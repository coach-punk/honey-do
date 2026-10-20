export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface TaskSection {
  id: string;
  title: string;
  tasks: TaskItem[];
  blankLinesCount: number;
}

export type PaperSize = 'letter' | 'a4';
export type LayoutMode = 'full-page' | 'half-sheet-2up';
export type PrintColumns = '1' | '2';
export type PrintContentMode = 'filled' | 'blank-template';

export interface HoneyDoList {
  id: string;
  title: string;
  subtitle: string;
  assignedTo: string;
  assignedBy: string;
  targetDate: string;
  sections: TaskSection[];
  paperSize: PaperSize;
  layoutMode: LayoutMode;
  columns: PrintColumns;
  printContentMode: PrintContentMode;
  createdAt: number;
  updatedAt: number;
}
