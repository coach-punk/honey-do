import React, { useState } from 'react';
import type { HoneyDoList } from '../types';

interface ExportImportModalProps {
  mode: 'export' | 'import';
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
  const [tab, setTab] = useState<'markdown' | 'json-current' | 'json-all' | 'import'>(
    initialMode === 'import' ? 'import' : 'markdown'
  );
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
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
        md += `- [${t.completed ? 'x' : ' '}] ${t.text}\n`;
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

  const currentJson = JSON.stringify(currentList, null, 2);
  const allJson = JSON.stringify(allLists, null, 2);

  const activeContent =
    tab === 'markdown' ? generateMarkdown() : tab === 'json-current' ? currentJson : allJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        onImport(parsed);
        onClose();
      } else if (parsed && typeof parsed === 'object' && parsed.sections) {
        onImport([parsed]);
        onClose();
      } else {
        setImportError('Invalid format. JSON must be a Honey-Do list object or array of lists.');
      }
    } catch {
      setImportError('JSON syntax error. Please verify valid JSON formatting.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {tab === 'import' ? 'Import Checklists' : 'Export Honey-Do List'}
          </div>
          <button type="button" className="icon-btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: '12px 20px 0', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`toolbar-btn ${tab === 'markdown' ? 'active' : ''}`}
            onClick={() => setTab('markdown')}
          >
            Markdown
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === 'json-current' ? 'active' : ''}`}
            onClick={() => setTab('json-current')}
          >
            JSON (Active)
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === 'json-all' ? 'active' : ''}`}
            onClick={() => setTab('json-all')}
          >
            JSON (All Lists)
          </button>
          <button
            type="button"
            className={`toolbar-btn ${tab === 'import' ? 'active' : ''}`}
            onClick={() => setTab('import')}
          >
            Import JSON
          </button>
        </div>

        <div className="modal-body">
          {tab === 'import' ? (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Paste exported Honey-Do JSON content below to restore your lists.
              </p>
              <textarea
                className="modal-textarea"
                placeholder="Paste JSON here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              {importError && (
                <div style={{ color: '#f87171', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  {importError}
                </div>
              )}
            </>
          ) : (
            <>
              <textarea className="modal-textarea" readOnly value={activeContent} />
            </>
          )}
        </div>

        <div className="modal-footer">
          {tab === 'import' ? (
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
              <button
                type="button"
                className="toolbar-btn toolbar-btn-primary"
                onClick={handleCopy}
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
