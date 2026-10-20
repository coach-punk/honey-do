import React, { useState } from 'react';
import type { HoneyDoList } from '../types';

interface SidebarProps {
  isOpen: boolean;
  lists: HoneyDoList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onNewList: (templateType?: 'blank' | 'maintenance' | 'weekend') => void;
  onDuplicateList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onOpenExportModal: () => void;
  onOpenImportModal: () => void;
  onClearCompleted: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  lists,
  activeListId,
  onSelectList,
  onNewList,
  onDuplicateList,
  onDeleteList,
  onOpenExportModal,
  onOpenImportModal,
  onClearCompleted,
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'} no-print`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">✓</div>
          <div>
            <div className="brand-title">Honey-Do</div>
          </div>
        </div>
        <span className="brand-badge">Studio</span>
      </div>

      <div className="sidebar-actions">
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn-new-list"
            onClick={() => setShowNewMenu(!showNewMenu)}
            style={{ width: '100%' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>New List</span>
          </button>

          {showNewMenu && (
            <div
              style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                right: 0,
                background: '#1a1d23',
                border: '1px solid #2b303c',
                borderRadius: '6px',
                padding: '4px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              }}
            >
              <button
                type="button"
                className="footer-btn"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => {
                  onNewList('blank');
                  setShowNewMenu(false);
                }}
              >
                📄 Blank Starter
              </button>
              <button
                type="button"
                className="footer-btn"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => {
                  onNewList('maintenance');
                  setShowNewMenu(false);
                }}
              >
                🏡 Home Maintenance
              </button>
              <button
                type="button"
                className="footer-btn"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => {
                  onNewList('weekend');
                  setShowNewMenu(false);
                }}
              >
                ⚡ Weekend Blitz
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-section-title">Saved Checklists ({lists.length})</div>

      <div className="list-scroll-area">
        {lists.map((list) => {
          const totalTasks = list.sections.reduce((acc, s) => acc + s.tasks.length, 0);
          const completedTasks = list.sections.reduce(
            (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
            0
          );
          const isActive = list.id === activeListId;

          return (
            <div
              key={list.id}
              className={`list-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectList(list.id)}
            >
              <div className="list-item-info">
                <span className="list-item-name">{list.title || 'Untitled List'}</span>
                <span className="list-item-meta">
                  {list.subtitle || `${totalTasks} items`} • {completedTasks}/{totalTasks} done
                </span>
              </div>

              <div className="list-item-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="icon-btn-ghost"
                  title="Duplicate list"
                  onClick={() => onDuplicateList(list.id)}
                  aria-label="Duplicate list"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                {lists.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn-ghost danger"
                    title="Delete list"
                    onClick={() => onDeleteList(list.id)}
                    aria-label="Delete list"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button type="button" className="footer-btn" onClick={onClearCompleted}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Clear Completed
        </button>

        <div className="footer-btn-row">
          <button type="button" className="footer-btn" onClick={onOpenExportModal}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button type="button" className="footer-btn" onClick={onOpenImportModal}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </button>
        </div>
      </div>
    </aside>
  );
};
