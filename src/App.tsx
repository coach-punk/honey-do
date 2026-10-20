import { useState, useEffect, useCallback } from 'react';
import type { HoneyDoList, PaperSize, LayoutMode, PrintColumns, PrintContentMode } from './types';
import { DEFAULT_LISTS, createNewList } from './defaultLists';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { PaperSheet } from './components/PaperSheet';
import { ExportImportModal } from './components/ExportImportModal';

const STORAGE_KEY_LISTS = 'honeydo_lists_storage_v1';
const STORAGE_KEY_ACTIVE = 'honeydo_active_list_id_v1';

export function App() {
  // LocalStorage initialization
  const [lists, setLists] = useState<HoneyDoList[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LISTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load lists from localStorage', e);
    }
    return DEFAULT_LISTS;
  });

  const [activeListId, setActiveListId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (savedId && lists.some((l) => l.id === savedId)) return savedId;
    } catch (e) {
      console.error('Failed to load active list id', e);
    }
    return lists[0]?.id || DEFAULT_LISTS[0].id;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalMode, setModalMode] = useState<'export' | 'import' | null>(null);

  // Sync lists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(lists));
    } catch (e) {
      console.error('Failed to persist lists to localStorage', e);
    }
  }, [lists]);

  // Sync active id to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeListId);
    } catch (e) {
      console.error('Failed to persist active id', e);
    }
  }, [activeListId]);

  // Keyboard shortcut: Cmd+P / Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        // Allow default browser print dialog
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  // Helper to update current active list
  const updateActiveList = useCallback(
    (updates: Partial<HoneyDoList>) => {
      setLists((prev) =>
        prev.map((l) => (l.id === activeListId ? { ...l, ...updates, updatedAt: Date.now() } : l))
      );
    },
    [activeListId]
  );

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  // List Management
  const handleNewList = (templateType?: 'blank' | 'maintenance' | 'weekend') => {
    let newList: HoneyDoList;
    if (templateType === 'maintenance') {
      newList = {
        ...DEFAULT_LISTS[0],
        id: 'list-' + Math.random().toString(36).substring(2, 9),
        title: 'HOME MAINTENANCE',
        subtitle: 'Seasonal & Home Care',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else if (templateType === 'weekend') {
      newList = {
        ...createNewList('WEEKEND BLITZ'),
        subtitle: 'Weekend Project Checklist',
        sections: [
          {
            id: 'sec-sat-am',
            title: 'Saturday Morning',
            blankLinesCount: 4,
            tasks: [{ id: 't-am1', text: 'Hardware store run for supplies', completed: false }],
          },
          {
            id: 'sec-sat-pm',
            title: 'Saturday Afternoon',
            blankLinesCount: 4,
            tasks: [],
          },
          {
            id: 'sec-sun',
            title: 'Sunday Projects & Wrap-up',
            blankLinesCount: 4,
            tasks: [],
          },
        ],
      };
    } else {
      newList = createNewList('HONEY-DO LIST');
    }

    setLists((prev) => [newList, ...prev]);
    setActiveListId(newList.id);
  };

  const handleDuplicateList = (id: string) => {
    const target = lists.find((l) => l.id === id);
    if (!target) return;
    const duplicated: HoneyDoList = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'list-' + Math.random().toString(36).substring(2, 9),
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLists((prev) => [duplicated, ...prev]);
    setActiveListId(duplicated.id);
  };

  const handleDeleteList = (id: string) => {
    if (lists.length <= 1) return;
    setLists((prev) => prev.filter((l) => l.id !== id));
    if (activeListId === id) {
      const remaining = lists.filter((l) => l.id !== id);
      setActiveListId(remaining[0]?.id || '');
    }
  };

  const handleClearCompleted = () => {
    if (!activeList) return;
    const cleanedSections = activeList.sections.map((sec) => ({
      ...sec,
      tasks: sec.tasks.filter((t) => !t.completed),
    }));
    updateActiveList({ sections: cleanedSections });
  };

  // Section & Task Actions
  const handleAddSection = () => {
    if (!activeList) return;
    const newSection = {
      id: 'sec-' + Math.random().toString(36).substring(2, 9),
      title: 'New Section',
      blankLinesCount: 3,
      tasks: [{ id: 't-' + Math.random().toString(36).substring(2, 9), text: '', completed: false }],
    };
    updateActiveList({ sections: [...activeList.sections, newSection] });
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    if (!activeList) return;
    const updated = activeList.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, title } : sec
    );
    updateActiveList({ sections: updated });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!activeList) return;
    const updated = activeList.sections.filter((sec) => sec.id !== sectionId);
    updateActiveList({ sections: updated });
  };

  const handleUpdateBlankLines = (sectionId: string, count: number) => {
    if (!activeList) return;
    const updated = activeList.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, blankLinesCount: count } : sec
    );
    updateActiveList({ sections: updated });
  };

  const handleAddTask = (sectionId: string, text = '') => {
    if (!activeList) return;
    const newTask = {
      id: 't-' + Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
    };
    const updated = activeList.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, tasks: [...sec.tasks, newTask] } : sec
    );
    updateActiveList({ sections: updated });
  };

  const handleUpdateTask = (
    sectionId: string,
    taskId: string,
    updates: Partial<{ text: string; completed: boolean; notes?: string }>
  ) => {
    if (!activeList) return;
    const updated = activeList.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        tasks: sec.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      };
    });
    updateActiveList({ sections: updated });
  };

  const handleDeleteTask = (sectionId: string, taskId: string) => {
    if (!activeList) return;
    const updated = activeList.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        tasks: sec.tasks.filter((t) => t.id !== taskId),
      };
    });
    updateActiveList({ sections: updated });
  };

  const handleImportLists = (imported: HoneyDoList[]) => {
    if (!imported || imported.length === 0) return;
    setLists((prev) => [...imported, ...prev]);
    setActiveListId(imported[0].id);
  };

  if (!activeList) return null;

  return (
    <div className="app-container">
      {/* Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onNewList={handleNewList}
        onDuplicateList={handleDuplicateList}
        onDeleteList={handleDeleteList}
        onOpenExportModal={() => setModalMode('export')}
        onOpenImportModal={() => setModalMode('import')}
        onClearCompleted={handleClearCompleted}
      />

      {/* Main Studio Workspace */}
      <main className="workspace">
        <Toolbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          paperSize={activeList.paperSize}
          onChangePaperSize={(paperSize: PaperSize) => updateActiveList({ paperSize })}
          layoutMode={activeList.layoutMode}
          onChangeLayoutMode={(layoutMode: LayoutMode) => updateActiveList({ layoutMode })}
          columns={activeList.columns}
          onChangeColumns={(columns: PrintColumns) => updateActiveList({ columns })}
          printContentMode={activeList.printContentMode}
          onChangePrintContentMode={(printContentMode: PrintContentMode) =>
            updateActiveList({ printContentMode })
          }
          onAddSection={handleAddSection}
          onPrint={handlePrint}
        />

        {/* Paper Canvas */}
        <div className="canvas-viewport">
          <PaperSheet
            list={activeList}
            onUpdateList={updateActiveList}
            onAddSection={handleAddSection}
            onUpdateSectionTitle={handleUpdateSectionTitle}
            onDeleteSection={handleDeleteSection}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateBlankLines={handleUpdateBlankLines}
          />
        </div>
      </main>

      {/* Export / Import Modal */}
      {modalMode && (
        <ExportImportModal
          mode={modalMode}
          currentList={activeList}
          allLists={lists}
          onClose={() => setModalMode(null)}
          onImport={handleImportLists}
        />
      )}
    </div>
  );
}

export default App;
