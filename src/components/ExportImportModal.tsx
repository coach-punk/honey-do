import React, { useState } from "react";
import type { HoneyDoList } from "../types";
import { exportToTodoTxt, importFromTodoTxt } from "../utils/todotxt";

interface ExportImportModalProps {
  mode: "export" | "import";
  currentList: HoneyDoList;
  allLists: HoneyDoList[];
  onClose: () => void;
  onImport: (importedLists: HoneyDoList[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  mode: initialMode,
  currentList,
  allLists,
  onClose,
  onImport,
}) => {
  const [tab, setTab] = useState<"markdown" | "todo-txt" | "json-current" | "json-all" | "import">(
    initialMode === "import" ? "import" : "markdown",
  );
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importFormat, setImportFormat] = useState<"auto" | "json" | "todotxt">("auto");
  const [importError, setImportError] = useState<string | null>(null);

  // Generate markdown representation
  const generateMarkdown = () => {
    let md = `# ${currentList.title}\n`;
    if (currentList.subtitle) md += `*${currentList.subtitle}*\n`;
    if (currentList.targetDate) md += `**Target Date:** ${currentList.targetDate}\n`;
    if (currentList.assignedTo) md += `**For:** ${currentList.assignedTo}\n`;
    md += `\n---\n\n`;

    currentList.sections.forEach((sec) => {
      md += `### ${sec.title}\n\n`;
      sec.tasks.forEach((t) => {
        md += `- [${t.completed ? "x" : " "}] ${t.text}\n`;
      });
      if (sec.blankLinesCount > 0) {
        for (let i = 0; i < sec.blankLinesCount; i++) {
          md += `- [ ] ___________________\n`;
        }
      }
      md += `\n`;
    });
    return md;
  };

  const todoTxtContent = exportToTodoTxt(currentList);
  const currentJson = JSON.stringify(currentList, null, 2);
  const allJson = JSON.stringify(allLists, null, 2);

  const activeContent =
    tab === "markdown"
      ? generateMarkdown()
      : tab === "todo-txt"
        ? todoTxtContent
        : tab === "json-current"
          ? currentJson
          : allJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const filename = `${currentList.title.toLowerCase().replace(/[^a-z0-9]+/g, "_") || "honey_do"}.txt`;
    const blob = new Blob([activeContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    const trimmed = importText.trim();
    if (!trimmed) {
      setImportError("Please paste content to import.");
      return;
    }

    const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[");
    const shouldParseAsJson = importFormat === "json" || (importFormat === "auto" && looksLikeJson);

    if (shouldParseAsJson) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          onImport(parsed);
          onClose();
          return;
        } else if (parsed && typeof parsed === "object" && parsed.sections) {
          onImport([parsed]);
          onClose();
          return;
        } else {
          setImportError("Invalid JSON structure. Must be a Honey-Do list object or array.");
          return;
        }
      } catch {
        if (importFormat === "json") {
          setImportError("JSON syntax error. Please verify formatting.");
          return;
        }
        // If auto mode failed JSON parse, fall through to Todo.txt
      }
    }

    // Parse as Todo.txt
    try {
      const imported = importFromTodoTxt(trimmed, "IMPORTED TODO.TXT LIST");
      if (imported && imported.sections.length > 0) {
        onImport([imported]);
        onClose();
      } else {
        setImportError("No tasks could be parsed from the provided text.");
      }
    } catch (e) {
      setImportError("Failed to parse Todo.txt content: " + String(e));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {tab === "import" ? "Import Checklists" : "Export Honey-Do List"}
          </div>
          <button type="button" className="icon-btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: "12px 20px 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`toolbar-btn ${tab === "markdown" ? "active" : ""}`}
            onClick={() => setTab("markdown")}
          >
            Markdown
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === "todo-txt" ? "active" : ""}`}
            onClick={() => setTab("todo-txt")}
            title="Export as standard Todo.txt format"
          >
            Todo.txt
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === "json-current" ? "active" : ""}`}
            onClick={() => setTab("json-current")}
          >
            JSON (Active)
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === "json-all" ? "active" : ""}`}
            onClick={() => setTab("json-all")}
          >
            JSON (All Lists)
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === "import" ? "active" : ""}`}
            onClick={() => setTab("import")}
          >
            Import
          </button>
        </div>

        <div className="modal-body">
          {tab === "import" ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                  Paste Honey-Do JSON or standard Todo.txt lines below:
                </p>
                <div
                  className="segmented-control"
                  style={{ transform: "scale(0.85)", transformOrigin: "right center" }}
                >
                  <button
                    type="button"
                    className={`segment-btn ${importFormat === "auto" ? "active" : ""}`}
                    onClick={() => setImportFormat("auto")}
                  >
                    Auto-Detect
                  </button>
                  <button
                    type="button"
                    className={`segment-btn ${importFormat === "todotxt" ? "active" : ""}`}
                    onClick={() => setImportFormat("todotxt")}
                  >
                    Todo.txt
                  </button>
                  <button
                    type="button"
                    className={`segment-btn ${importFormat === "json" ? "active" : ""}`}
                    onClick={() => setImportFormat("json")}
                  >
                    JSON
                  </button>
                </div>
              </div>
              <textarea
                className="modal-textarea"
                placeholder={`Paste here...\n\nExample Todo.txt:\n(A) Fix kitchen faucet +Plumbing @home due:2026-10-25\nx 2026-10-20 Buy 2x4 lumber +Garage @store`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              {importError && (
                <div style={{ color: "#f87171", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                  {importError}
                </div>
              )}
            </>
          ) : (
            <>
              {tab === "todo-txt" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "8px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Standard Todo.txt format • Sections converted to +projects • Priorities as (A)
                </p>
              )}
              <textarea className="modal-textarea" readOnly value={activeContent} />
            </>
          )}
        </div>

        <div className="modal-footer">
          {tab === "import" ? (
            <>
              <button type="button" className="toolbar-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="toolbar-btn toolbar-btn-primary"
                onClick={handleImportSubmit}
              >
                Import Data
              </button>
            </>
          ) : (
            <>
              <button type="button" className="toolbar-btn" onClick={onClose}>
                Done
              </button>
              {(tab === "todo-txt" || tab === "markdown") && (
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={handleDownloadTxt}
                  title="Download as .txt file"
                >
                  Download File
                </button>
              )}
              <button
                type="button"
                className="toolbar-btn toolbar-btn-primary"
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
