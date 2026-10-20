import React, { useState } from "react";
import type { HoneyDoList, TaskItem, TaskFilter } from "../types";
import { SectionBlock } from "./SectionBlock";

interface PaperSheetProps {
  list: HoneyDoList;
  taskFilter?: TaskFilter;
  onUpdateList: (updates: Partial<HoneyDoList>) => void;
  onAddSection: () => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddTask: (sectionId: string, text?: string) => void;
  onUpdateTask: (sectionId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onUpdateBlankLines: (sectionId: string, count: number) => void;
}

export const PaperSheet: React.FC<PaperSheetProps> = ({
  list,
  taskFilter = "all",
  onUpdateList,
  onAddSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateBlankLines,
}) => {
  const [halfSheetMode, setHalfSheetMode] = useState<"split" | "twin">("split");

  const formatClass =
    list.layoutMode === "half-sheet-2up"
      ? "format-half-sheet-2up"
      : list.paperSize === "a4"
        ? "format-a4-portrait"
        : "format-letter-portrait";

  const isBlankTemplate = list.printContentMode === "blank-template";
  const showBujo = list.bulletStyle === "bujo";
  const showLegend = showBujo && list.showBujoLegend !== false;

  // Format print date safely from list.updatedAt / createdAt
  const todayFormatted = React.useMemo(() => {
    const timestamp = list.updatedAt || list.createdAt || 0;
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [list.updatedAt, list.createdAt]);

  // Common Header Renderer
  const renderHeader = (isCompact = false) => (
    <div className="paper-header">
      <div className="paper-title-row">
        <input
          type="text"
          className="paper-title-input"
          style={isCompact ? { fontSize: "18px" } : undefined}
          value={list.title}
          onChange={(e) => onUpdateList({ title: e.target.value })}
          placeholder="HONEY-DO LIST"
        />
      </div>
      <input
        type="text"
        className="paper-subtitle-input"
        value={list.subtitle}
        onChange={(e) => onUpdateList({ subtitle: e.target.value })}
        placeholder="Subtitle or description..."
      />
      <div className="paper-meta-row">
        <div className="meta-field">
          <span className="meta-label">For:</span>
          <input
            type="text"
            className="meta-input"
            value={list.assignedTo}
            onChange={(e) => onUpdateList({ assignedTo: e.target.value })}
            placeholder="Honey"
          />
        </div>
        <div className="meta-field">
          <span className="meta-label">Target:</span>
          <input
            type="text"
            className="meta-input"
            value={list.targetDate}
            onChange={(e) => onUpdateList({ targetDate: e.target.value })}
            placeholder="This Weekend"
          />
        </div>
        <div className="meta-field">
          <span className="meta-label">From:</span>
          <input
            type="text"
            className="meta-input"
            value={list.assignedBy}
            onChange={(e) => onUpdateList({ assignedBy: e.target.value })}
            placeholder="Me"
          />
        </div>
      </div>
    </div>
  );

  // Common Footer Renderer with BuJo Key Legend
  const renderFooter = () => (
    <footer className="paper-footer">
      <div className="footer-top-row">
        {showLegend && (
          <div className="bujo-footer-legend" title="Bullet Journal Rapid Logging Key">
            <span className="bujo-legend-title">BUJO KEY:</span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">•</span> Task
            </span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">✕</span> Done
            </span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">&gt;</span> Migrated
            </span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">&lt;</span> Scheduled
            </span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">★</span> Priority
            </span>
            <span className="bujo-legend-item">
              <span className="bujo-legend-glyph">—</span> Note
            </span>
          </div>
        )}
      </div>
      <div className="footer-bottom-row">
        <span className="footer-quote">
          {showBujo ? "Rapid Logging • Honey-Do" : "Done with care • Honey-Do"}
        </span>
        <span className="footer-print-date">{todayFormatted}</span>
      </div>
    </footer>
  );

  // -------------------------------------------------------------------------
  // Half-Sheet 2-Up Layout
  // -------------------------------------------------------------------------
  if (list.layoutMode === "half-sheet-2up") {
    const halfIndex = Math.ceil(list.sections.length / 2);
    const leftSections =
      halfSheetMode === "split" ? list.sections.slice(0, halfIndex) : list.sections;
    const rightSections =
      halfSheetMode === "split" ? list.sections.slice(halfIndex) : list.sections;

    return (
      <div className={`paper-sheet ${formatClass} ${isBlankTemplate ? "mode-blank-template" : ""}`}>
        {/* Screen-only toggle for twin vs split */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--paper-text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            2-Up Format:
          </span>
          <div className="segmented-control" style={{ background: "#f1f3f5" }}>
            <button
              type="button"
              className={`segment-btn ${halfSheetMode === "split" ? "active" : ""}`}
              style={
                halfSheetMode === "split"
                  ? { background: "#111", color: "#fff" }
                  : { color: "#555" }
              }
              onClick={() => setHalfSheetMode("split")}
            >
              Split Sections Across Halves
            </button>
            <button
              type="button"
              className={`segment-btn ${halfSheetMode === "twin" ? "active" : ""}`}
              style={
                halfSheetMode === "twin" ? { background: "#111", color: "#fff" } : { color: "#555" }
              }
              onClick={() => setHalfSheetMode("twin")}
            >
              Twin Duplicate Copies
            </button>
          </div>
        </div>

        <div className="half-sheet-container">
          {/* Left Half (5.5" x 8.5") */}
          <div className="half-sheet-column">
            {renderHeader(true)}
            <div className="sections-container cols-1">
              {leftSections.map((sec) => (
                <SectionBlock
                  key={sec.id}
                  section={sec}
                  printContentMode={list.printContentMode}
                  bulletStyle={list.bulletStyle}
                  taskFilter={taskFilter}
                  onUpdateTitle={(title) => onUpdateSectionTitle(sec.id, title)}
                  onDeleteSection={() => onDeleteSection(sec.id)}
                  onAddTask={(text) => onAddTask(sec.id, text)}
                  onUpdateTask={(tId, u) => onUpdateTask(sec.id, tId, u)}
                  onDeleteTask={(tId) => onDeleteTask(sec.id, tId)}
                  onUpdateBlankLines={(count) => onUpdateBlankLines(sec.id, count)}
                />
              ))}
            </div>
            {renderFooter()}
          </div>

          {/* Center Cut Line */}
          <div className="half-sheet-divider">
            <div className="cut-line-indicator">✂ CUT HERE ✂</div>
          </div>

          {/* Right Half (5.5" x 8.5") */}
          <div className="half-sheet-column">
            {renderHeader(true)}
            <div className="sections-container cols-1">
              {rightSections.map((sec) => (
                <SectionBlock
                  key={sec.id + (halfSheetMode === "twin" ? "-copy" : "")}
                  section={sec}
                  printContentMode={list.printContentMode}
                  bulletStyle={list.bulletStyle}
                  taskFilter={taskFilter}
                  onUpdateTitle={(title) => onUpdateSectionTitle(sec.id, title)}
                  onDeleteSection={() => onDeleteSection(sec.id)}
                  onAddTask={(text) => onAddTask(sec.id, text)}
                  onUpdateTask={(tId, u) => onUpdateTask(sec.id, tId, u)}
                  onDeleteTask={(tId) => onDeleteTask(sec.id, tId)}
                  onUpdateBlankLines={(count) => onUpdateBlankLines(sec.id, count)}
                />
              ))}
            </div>
            {renderFooter()}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Standard Full-Page Layout (Letter / A4)
  // -------------------------------------------------------------------------
  return (
    <div className={`paper-sheet ${formatClass} ${isBlankTemplate ? "mode-blank-template" : ""}`}>
      {renderHeader(false)}

      <div className={`sections-container cols-${list.columns}`}>
        {list.sections.map((sec) => (
          <SectionBlock
            key={sec.id}
            section={sec}
            printContentMode={list.printContentMode}
            bulletStyle={list.bulletStyle}
            taskFilter={taskFilter}
            onUpdateTitle={(title) => onUpdateSectionTitle(sec.id, title)}
            onDeleteSection={() => onDeleteSection(sec.id)}
            onAddTask={(text) => onAddTask(sec.id, text)}
            onUpdateTask={(tId, u) => onUpdateTask(sec.id, tId, u)}
            onDeleteTask={(tId) => onDeleteTask(sec.id, tId)}
            onUpdateBlankLines={(count) => onUpdateBlankLines(sec.id, count)}
          />
        ))}
      </div>

      {/* Screen-only Add Section Prompt */}
      <button type="button" className="btn-add-section-canvas no-print" onClick={onAddSection}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Another Section
      </button>

      {renderFooter()}
    </div>
  );
};
