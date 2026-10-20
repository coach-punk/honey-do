import type { HoneyDoList, TaskItem, TaskSection } from "../types";

/**
 * Normalizes section title to a clean Todo.txt project name (+ProjectName).
 * e.g., "GARAGE & WORKSHOP" -> "Garage_Workshop"
 */
export function titleToProjectTag(title: string): string {
  const cleaned = title
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");
  return cleaned || "General";
}

/**
 * Converts a Todo.txt project name back to human readable section title.
 * e.g., "Garage_Workshop" -> "GARAGE & WORKSHOP" or "Garage Workshop"
 */
export function projectTagToTitle(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .replace(/\band\b/gi, "&")
    .toUpperCase();
}

/**
 * Formats a date into YYYY-MM-DD.
 */
function formatDate(timestamp: number | Date = new Date()): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Exports a HoneyDoList into standard Todo.txt plain text.
 */
export function exportToTodoTxt(list: HoneyDoList): string {
  const lines: string[] = [];
  const today = formatDate();

  // Header comment for context
  lines.push(`# Honey-Do: ${list.title}`);
  if (list.subtitle) lines.push(`# Subtitle: ${list.subtitle}`);
  if (list.assignedTo) lines.push(`# Assigned To: ${list.assignedTo}`);
  if (list.targetDate) lines.push(`# Target Date: ${list.targetDate}`);
  lines.push("");

  list.sections.forEach((section) => {
    const projectTag = titleToProjectTag(section.title);

    section.tasks.forEach((task) => {
      if (!task.text.trim()) return;

      const parts: string[] = [];

      // 1. Completion marker & completion date
      if (task.completed || task.signifier === "completed") {
        parts.push("x", today);
      } else if (task.priority) {
        // 2. Priority: (A), (B), etc.
        const pri = task.priority.toUpperCase().replace(/[()]/g, "");
        parts.push(`(${pri})`);
      }

      // 3. Task text
      parts.push(task.text.trim());

      // 4. Project (+ProjectName)
      parts.push(`+${projectTag}`);

      // 5. Contexts (@context)
      if (task.contexts && task.contexts.length > 0) {
        task.contexts.forEach((ctx) => {
          const formattedCtx = ctx.startsWith("@") ? ctx : `@${ctx}`;
          parts.push(formattedCtx);
        });
      }

      // 6. Due date (due:YYYY-MM-DD)
      if (task.dueDate) {
        parts.push(`due:${task.dueDate}`);
      }

      // 7. BuJo signifier key-value if not default
      if (task.signifier && task.signifier !== "todo" && task.signifier !== "completed") {
        parts.push(`bujo:${task.signifier}`);
      }

      lines.push(parts.join(" "));
    });
  });

  return lines.join("\n");
}

/**
 * Parses raw Todo.txt content into a structured HoneyDoList.
 */
export function importFromTodoTxt(
  rawText: string,
  defaultTitle = "IMPORTED TODO.TXT LIST",
): HoneyDoList {
  const lines = rawText.split(/\r?\n/);
  const sectionMap = new Map<string, TaskItem[]>();
  const defaultSectionKey = "GENERAL TASKS";

  let listTitle = defaultTitle;
  let subtitle = "Imported from Todo.txt";
  let assignedTo = "";
  let targetDate = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Parse header comments if any
    if (line.startsWith("#")) {
      const comment = line.replace(/^#+\s*/, "");
      if (comment.toLowerCase().startsWith("honey-do:")) {
        listTitle =
          comment
            .replace(/^honey-do:\s*/i, "")
            .trim()
            .toUpperCase() || listTitle;
      } else if (comment.toLowerCase().startsWith("subtitle:")) {
        subtitle = comment.replace(/^subtitle:\s*/i, "").trim() || subtitle;
      } else if (comment.toLowerCase().startsWith("assigned to:")) {
        assignedTo = comment.replace(/^assigned to:\s*/i, "").trim() || assignedTo;
      } else if (comment.toLowerCase().startsWith("target date:")) {
        targetDate = comment.replace(/^target date:\s*/i, "").trim() || targetDate;
      }
      continue;
    }

    let remaining = line;
    let completed = false;
    let priority: string | null = null;
    const contexts: string[] = [];
    let dueDate: string | undefined = undefined;
    let signifier: TaskItem["signifier"] = undefined;
    let projectTag: string | null = null;

    // Check completion: starts with "x "
    if (/^x\s+/i.test(remaining)) {
      completed = true;
      remaining = remaining.replace(/^x\s+/i, "");
      // Check for completion date: YYYY-MM-DD
      const dateMatch = remaining.match(/^(\d{4}-\d{2}-\d{2})\s+/);
      if (dateMatch) {
        remaining = remaining.slice(dateMatch[0].length);
      }
    }

    // Check priority: (A)
    const priMatch = remaining.match(/^(\([A-Za-z]\))\s+/);
    if (priMatch) {
      priority = priMatch[1].replace(/[()]/g, "").toUpperCase();
      remaining = remaining.slice(priMatch[0].length);
    }

    // Check creation date: YYYY-MM-DD
    const creationMatch = remaining.match(/^(\d{4}-\d{2}-\d{2})\s+/);
    if (creationMatch) {
      remaining = remaining.slice(creationMatch[0].length);
    }

    // Extract tags from remaining string
    const tokens = remaining.split(/\s+/);
    const textTokens: string[] = [];

    for (const token of tokens) {
      if (token.startsWith("+") && token.length > 1) {
        if (!projectTag) {
          projectTag = token.slice(1);
        }
      } else if (token.startsWith("@") && token.length > 1) {
        contexts.push(token);
      } else if (token.toLowerCase().startsWith("due:")) {
        dueDate = token.slice(4);
      } else if (token.toLowerCase().startsWith("bujo:")) {
        const val = token.slice(5) as TaskItem["signifier"];
        if (
          ["migrated", "scheduled", "priority", "note", "todo", "completed"].includes(val as string)
        ) {
          signifier = val;
        }
      } else {
        textTokens.push(token);
      }
    }

    const taskText = textTokens.join(" ").trim();
    if (!taskText && !projectTag) continue;

    const sectionTitle = projectTag ? projectTagToTitle(projectTag) : defaultSectionKey;

    if (!signifier) {
      signifier = completed ? "completed" : priority === "A" ? "priority" : "todo";
    }

    const taskItem: TaskItem = {
      id: "task-" + Math.random().toString(36).substring(2, 9),
      text: taskText || "Untitled task",
      completed,
      priority,
      contexts: contexts.length > 0 ? contexts : undefined,
      dueDate,
      signifier,
    };

    if (!sectionMap.has(sectionTitle)) {
      sectionMap.set(sectionTitle, []);
    }
    sectionMap.get(sectionTitle)!.push(taskItem);
  }

  // Build sections
  const sections: TaskSection[] = [];
  sectionMap.forEach((tasks, title) => {
    sections.push({
      id: "sec-" + Math.random().toString(36).substring(2, 9),
      title,
      tasks,
      blankLinesCount: 2,
    });
  });

  if (sections.length === 0) {
    sections.push({
      id: "sec-" + Math.random().toString(36).substring(2, 9),
      title: "GENERAL TASKS",
      tasks: [],
      blankLinesCount: 4,
    });
  }

  const now = Date.now();
  return {
    id: "list-" + Math.random().toString(36).substring(2, 9),
    title: listTitle,
    subtitle,
    assignedTo,
    assignedBy: "",
    targetDate,
    sections,
    paperSize: "letter",
    layoutMode: "full-page",
    columns: sections.length > 2 ? "2" : "1",
    printContentMode: "filled",
    bulletStyle: "checkbox",
    showBujoLegend: true,
    createdAt: now,
    updatedAt: now,
  };
}
