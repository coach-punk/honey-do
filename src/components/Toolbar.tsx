import React from 'react';
import type { PaperSize, LayoutMode, PrintColumns, PrintContentMode } from '../types';

interface ToolbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  paperSize: PaperSize;
  onChangePaperSize: (size: PaperSize) => void;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  columns: PrintColumns;
  onChangeColumns: (cols: PrintColumns) => void;
  printContentMode: PrintContentMode;
  onChangePrintContentMode: (mode: PrintContentMode) => void;
  onAddSection: () => void;
  onPrint: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  paperSize,
  onChangePaperSize,
  layoutMode,
  onChangeLayoutMode,
  columns,
  onChangeColumns,
  printContentMode,
  onChangePrintContentMode,
  onAddSection,
  onPrint,
}) => {
  return (
    <header className="toolbar no-print">
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Hide list drawer' : 'Show list drawer'}
          aria-label="Toggle sidebar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Lists</span>
        </button>

        <div className="toolbar-divider" />

        {/* Print Content Mode: Filled vs Blank Template */}
        <div className="toolbar-group">
          <span className="toolbar-label">Content:</span>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${printContentMode === 'filled' ? 'active' : ''}`}
              onClick={() => onChangePrintContentMode('filled')}
              title="Print typed tasks + write-in lines"
            >
              Filled Tasks
            </button>
            <button
              type="button"
              className={`segment-btn ${printContentMode === 'blank-template' ? 'active' : ''}`}
              onClick={() => onChangePrintContentMode('blank-template')}
              title="Print empty ruled lines for pen & paper handwriting"
            >
              Blank Template
            </button>
          </div>
        </div>

        <div className="toolbar-divider" />

        {/* Layout: Full Page vs Half-Sheet 2-Up */}
        <div className="toolbar-group">
          <span className="toolbar-label">Layout:</span>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${layoutMode === 'full-page' ? 'active' : ''}`}
              onClick={() => onChangeLayoutMode('full-page')}
              title="Standard Full Sheet (Letter / A4)"
            >
              Full Page
            </button>
            <button
              type="button"
              className={`segment-btn ${layoutMode === 'half-sheet-2up' ? 'active' : ''}`}
              onClick={() => onChangeLayoutMode('half-sheet-2up')}
              title="Two 5.5x8.5 mini notepads side-by-side to cut in half"
            >
              Half-Sheet (2-Up)
            </button>
          </div>
        </div>

        {/* Columns: only if full-page */}
        {layoutMode === 'full-page' && (
          <div className="toolbar-group">
            <div className="segmented-control">
              <button
                type="button"
                className={`segment-btn ${columns === '1' ? 'active' : ''}`}
                onClick={() => onChangeColumns('1')}
                title="1 Column layout"
              >
                1 Col
              </button>
              <button
                type="button"
                className={`segment-btn ${columns === '2' ? 'active' : ''}`}
                onClick={() => onChangeColumns('2')}
                title="2 Columns layout"
              >
                2 Cols
              </button>
            </div>
          </div>
        )}

        <div className="toolbar-divider" />

        {/* Paper Size */}
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-btn ${paperSize === 'letter' ? 'active' : ''}`}
            onClick={() => onChangePaperSize('letter')}
            title="US Letter (8.5 × 11 in)"
          >
            Letter
          </button>
          <button
            type="button"
            className={`segment-btn ${paperSize === 'a4' ? 'active' : ''}`}
            onClick={() => onChangePaperSize('a4')}
            title="A4 (210 × 297 mm)"
          >
            A4
          </button>
        </div>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          onClick={onAddSection}
          title="Add a new categorized section"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add Section</span>
        </button>

        <button
          type="button"
          className="toolbar-btn toolbar-btn-primary"
          onClick={onPrint}
          title="Open system print dialog (⌘P)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Print List</span>
        </button>
      </div>
    </header>
  );
};
