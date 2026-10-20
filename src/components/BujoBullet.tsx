import React, { useState, useRef, useEffect } from "react";
import type { TaskSignifier, BulletStyle } from "../types";

interface BujoBulletProps {
  bulletStyle?: BulletStyle;
  signifier?: TaskSignifier;
  completed: boolean;
  onToggle: () => void;
  onSelectSignifier: (signifier: TaskSignifier) => void;
}

const BUJO_OPTIONS: { id: TaskSignifier; label: string; icon: string; desc: string }[] = [
  { id: "todo", label: "Task", icon: "•", desc: "Incomplete Task" },
  { id: "completed", label: "Done", icon: "✕", desc: "Completed Task" },
  { id: "migrated", label: "Migrated", icon: ">", desc: "Moved Forward (>)" },
  { id: "scheduled", label: "Scheduled", icon: "<", desc: "Calendar / Appt (<)" },
  { id: "priority", label: "Priority", icon: "★", desc: "Urgent / Priority (*)" },
  { id: "note", label: "Note", icon: "—", desc: "Observation / Note (—)" },
];

export const BujoBullet: React.FC<BujoBulletProps> = ({
  bulletStyle = "checkbox",
  signifier,
  completed,
  onToggle,
  onSelectSignifier,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [menuOpen]);

  // If classic checkbox mode
  if (bulletStyle !== "bujo") {
    return (
      <div
        className={`task-checkbox-mock ${completed ? "checked" : ""}`}
        onClick={onToggle}
        title="Click to toggle checkmark"
        role="checkbox"
        aria-checked={completed}
      />
    );
  }

  // Determine current active signifier
  const currentSignifier: TaskSignifier = signifier || (completed ? "completed" : "todo");

  const renderSignifierIcon = (sig: TaskSignifier) => {
    switch (sig) {
      case "completed":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      case "migrated":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        );
      case "scheduled":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        );
      case "priority":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case "note":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );
      case "todo":
      default:
        return <div className="bujo-dot-glyph" />;
    }
  };

  return (
    <div className="bujo-bullet-container" ref={containerRef}>
      <div
        className={`bujo-bullet-mock bujo-sig-${currentSignifier} ${completed ? "completed" : ""}`}
        onClick={onToggle}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(true);
        }}
        title={`BuJo: ${currentSignifier.toUpperCase()} (Click to toggle done, right-click for signifiers)`}
      >
        {renderSignifierIcon(currentSignifier)}
      </div>

      {/* Screen-only signifier picker toggle button */}
      <button
        type="button"
        className="bujo-picker-trigger no-print"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        title="Change BuJo signifier"
        aria-label="Change BuJo signifier"
      >
        ▾
      </button>

      {/* Popover menu for BuJo signifiers */}
      {menuOpen && (
        <div className="bujo-popover no-print" onClick={(e) => e.stopPropagation()}>
          <div className="bujo-popover-title">Bullet Signifier</div>
          <div className="bujo-popover-grid">
            {BUJO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`bujo-option-btn ${currentSignifier === opt.id ? "active" : ""}`}
                onClick={() => {
                  onSelectSignifier(opt.id);
                  setMenuOpen(false);
                }}
                title={opt.desc}
              >
                <span className="bujo-option-icon">{renderSignifierIcon(opt.id)}</span>
                <span className="bujo-option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
