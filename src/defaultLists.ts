import type { HoneyDoList } from './types';

export const DEFAULT_LISTS: HoneyDoList[] = [
  {
    id: 'list-weekend-maintenance',
    title: 'HONEY-DO LIST',
    subtitle: 'Weekend Maintenance & Fixes',
    assignedTo: 'Honey',
    assignedBy: '',
    targetDate: 'This Weekend',
    paperSize: 'letter',
    layoutMode: 'full-page',
    columns: '2',
    printContentMode: 'filled',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    sections: [
      {
        id: 'sec-yard',
        title: 'Yard & Exterior',
        blankLinesCount: 2,
        tasks: [
          { id: 't1', text: 'Clean leaves from front and back gutters', completed: false },
          { id: 't2', text: 'Trim back overhanging branches near roof line', completed: false },
          { id: 't3', text: 'Check and insulate outdoor garden hose spigots', completed: false },
          { id: 't4', text: 'Touch up peeling paint on front porch rail', completed: false },
        ],
      },
      {
        id: 'sec-garage',
        title: 'Garage & Workshop',
        blankLinesCount: 2,
        tasks: [
          { id: 't5', text: 'Replace 20x25x1 furnace / HVAC air filter', completed: false },
          { id: 't6', text: 'Organize extension cords and hang garden tools', completed: false },
          { id: 't7', text: 'Test garage door auto-reverse safety sensors', completed: false },
        ],
      },
      {
        id: 'sec-kitchen',
        title: 'Kitchen & Bath',
        blankLinesCount: 2,
        tasks: [
          { id: 't8', text: 'Fix slow drip under powder room sink faucet', completed: false },
          { id: 't9', text: 'Recaulk silicone seam along master shower base', completed: false },
          { id: 't10', text: 'Degrease and soak stove range hood mesh filters', completed: false },
        ],
      },
      {
        id: 'sec-quick',
        title: 'Quick 15-Minute Fixes',
        blankLinesCount: 3,
        tasks: [
          { id: 't11', text: 'WD-40 squeaky hinge on pantry door', completed: false },
          { id: 't12', text: 'Replace 9V battery in upstairs hallway smoke alarm', completed: false },
          { id: 't13', text: 'Tighten loose doorknob on basement door', completed: false },
        ],
      },
    ],
  },
  {
    id: 'list-blank-starter',
    title: 'HONEY-DO LIST',
    subtitle: 'Weekly Projects & Tasks',
    assignedTo: '',
    assignedBy: '',
    targetDate: '',
    paperSize: 'letter',
    layoutMode: 'full-page',
    columns: '2',
    printContentMode: 'filled',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    sections: [
      {
        id: 'sec-urgent',
        title: 'Must Do First',
        blankLinesCount: 4,
        tasks: [
          { id: 'tb1', text: 'Change oil in lawn mower', completed: false },
        ],
      },
      {
        id: 'sec-house',
        title: 'Around The House',
        blankLinesCount: 5,
        tasks: [],
      },
      {
        id: 'sec-hardware',
        title: 'Hardware Store & Errands',
        blankLinesCount: 5,
        tasks: [],
      },
      {
        id: 'sec-later',
        title: 'When You Get A Chance',
        blankLinesCount: 5,
        tasks: [],
      },
    ],
  },
];

export function createNewList(title: string = 'HONEY-DO LIST'): HoneyDoList {
  return {
    id: 'list-' + Math.random().toString(36).substring(2, 9),
    title,
    subtitle: 'Tasks & Projects',
    assignedTo: '',
    assignedBy: '',
    targetDate: '',
    paperSize: 'letter',
    layoutMode: 'full-page',
    columns: '2',
    printContentMode: 'filled',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    sections: [
      {
        id: 'sec-' + Math.random().toString(36).substring(2, 9),
        title: 'Priority Tasks',
        blankLinesCount: 4,
        tasks: [],
      },
      {
        id: 'sec-' + Math.random().toString(36).substring(2, 9),
        title: 'General Maintenance',
        blankLinesCount: 4,
        tasks: [],
      },
    ],
  };
}
