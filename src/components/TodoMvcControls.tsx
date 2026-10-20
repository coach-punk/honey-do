import React from "react";
import type { TaskFilter, HoneyDoList } from "../types";

interface TodoMvcControlsProps {
  list: HoneyDoList;
  currentFilter: TaskFilter;
  onChangeFilter: (filter: TaskFilter) => void;
  onClearCompleted: () => void;
  onToggleAll: () => void;
}

export const TodoMvcControls: React.FC<TodoMvcControlsProps> = ({
  list,
  currentFilter,
  onChangeFilter,
  onClearCompleted,
  onToggleAll,
}) => {
  // Aggregate stats across all sections
  let totalTasks = 0;
  let activeTasks = 0;
  let completedTasks = 0;

  list.sections.forEach((sec) => {
    sec.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed || t.signifier === "completed") {
        completedTasks++;
      } else {
        activeTasks++;
      }
    });
  });

  const allCompleted = totalTasks > 0 && activeTasks === 0;

  return (
    <div className="todomvc-bar no-print">
      <div className="todomvc-group">
        <button
          type="button"
          className={`todomvc-btn-toggle-all ${allCompleted ? "active" : ""}`}
          onClick={onToggleAll}
          title={allCompleted ? "Mark all as active" : "Mark all as completed"}
          disabled={totalTasks === 0}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{allCompleted ? "Uncheck All" : "Toggle All"}</span>
        </button>

        <span className="todomvc-count">
          <strong>{activeTasks}</strong> {activeTasks === 1 ? "item" : "items"} left
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="todomvc-filters">
        <button
          type="button"
          className={`todomvc-filter-btn ${currentFilter === "all" ? "active" : ""}`}
          onClick={() => onChangeFilter("all")}
        >
          All ({totalTasks})
        </button>
        <button
          type="button"
          className={`todomvc-filter-btn ${currentFilter === "active" ? "active" : ""}`}
          onClick={() => onChangeFilter("active")}
        >
          Active ({activeTasks})
        </button>
        <button
          type="button"
          className={`todomvc-filter-btn ${currentFilter === "completed" ? "active" : ""}`}
          onClick={() => onChangeFilter("completed")}
        >
          Completed ({completedTasks})
        </button>
      </div>

      {/* Clear Completed */}
      <div className="todomvc-actions">
        {completedTasks > 0 ? (
          <button
            type="button"
            className="todomvc-clear-btn"
            onClick={onClearCompleted}
            title="Remove completed items from list"
          >
            Clear completed ({completedTasks})
          </button>
        ) : (
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {totalTasks === 0 ? "No tasks yet" : "None completed"}
          </span>
        )}
      </div>
    </div>
  );
};
