import React, { useRef } from 'react';
import type { TaskSection, TaskItem, PrintContentMode } from '../types';

interface SectionBlockProps {
  section: TaskSection;
  printContentMode: PrintContentMode;
  onUpdateTitle: (title: string) => void;
  onDeleteSection: () => void;
  onAddTask: (text?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateBlankLines: (count: number) => void;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  printContentMode,
  onUpdateTitle,
  onDeleteSection,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateBlankLines,
}) => {
  const taskInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, task: TaskItem) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTask('');
      setTimeout(() => {
        const nextTasks = section.tasks;
        if (nextTasks.length > index + 1) {
          const nextId = nextTasks[index + 1]?.id;
          if (nextId && taskInputsRef.current[nextId]) {
            taskInputsRef.current[nextId]?.focus();
          }
        }
      }, 50);
    } else if (e.key === 'Backspace' && task.text === '' && section.tasks.length > 0) {
      e.preventDefault();
      onDeleteTask(task.id);
      if (index > 0) {
        const prevId = section.tasks[index - 1]?.id;
        if (prevId && taskInputsRef.current[prevId]) {
          taskInputsRef.current[prevId]?.focus();
        }
      }
    }
  };

  const isBlankTemplate = printContentMode === 'blank-template';
  const effectiveBlankCount = isBlankTemplate
    ? Math.max(section.blankLinesCount + section.tasks.length, 5)
    : section.blankLinesCount;

  return (
    <div className="sheet-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <input
            type="text"
            className="section-title-input"
            value={section.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="SECTION TITLE..."
          />
        </div>

        <div className="section-controls no-print">
          <div className="blank-line-stepper" title="Blank handwriting lines for pen write-ins">
            <span>Lines:</span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onUpdateBlankLines(Math.max(0, section.blankLinesCount - 1))}
              aria-label="Decrease blank lines"
            >
              -
            </button>
            <span style={{ minWidth: '12px', textAlign: 'center' }}>{section.blankLinesCount}</span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onUpdateBlankLines(section.blankLinesCount + 1)}
              aria-label="Increase blank lines"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="icon-btn-ghost danger"
            onClick={onDeleteSection}
            title="Delete section"
            aria-label="Delete section"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Actual tasks (hidden when printContentMode === 'blank-template') */}
      {!isBlankTemplate && (
        <div className="task-list">
          {section.tasks.map((task, idx) => (
            <div key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
              <div
                className={`task-checkbox-mock ${task.completed ? 'checked' : ''}`}
                onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                title="Click to toggle checkmark"
              />
              <input
                ref={(el) => {
                  taskInputsRef.current[task.id] = el;
                }}
                type="text"
                className="task-text-input"
                value={task.text}
                onChange={(e) => onUpdateTask(task.id, { text: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, idx, task)}
                placeholder="Enter task item..."
              />
              <button
                type="button"
                className="task-delete-btn no-print"
                onClick={() => onDeleteTask(task.id)}
                title="Delete task"
                aria-label="Delete task"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Blank ruled lines for pen write-ins */}
      {effectiveBlankCount > 0 && (
        <div className="blank-lines-group">
          {Array.from({ length: effectiveBlankCount }).map((_, i) => (
            <div key={i} className="blank-ruled-line" title="Blank handwriting line for pen">
              <div className="task-checkbox-mock" />
              <div className="blank-line-rule" />
            </div>
          ))}
        </div>
      )}

      {/* Add Task prompt button (Screen only) */}
      {!isBlankTemplate && (
        <button
          type="button"
          className="btn-add-task-inline no-print"
          onClick={() => onAddTask('')}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Task
        </button>
      )}
    </div>
  );
};
