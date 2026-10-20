# Honey-Do — Printable Checklist Studio

> A clean, minimal monochrome checklist studio crafted specifically for physical printing. Type your tasks digitally, print razor-sharp sheets for the fridge or workshop, and write in new items on the fly with designated handwriting lines.

![Honey-Do Preview](https://img.shields.io/badge/Design-Minimal_Monochrome-000000?style=for-the-badge)
![Print Ready](https://img.shields.io/badge/Print-Letter_%26_A4-success?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)

---

## ✨ Features

- **WYSIWYG Paper Canvas**: The editing interface looks and behaves like an authentic physical sheet of paper resting on an architect's desk. Click any task, section header, or metadata field to edit in-place.
- **Zero Ink Waste / Laser-Friendly Print Styling**: Engineered with crisp monochrome lines (`#000000` on `#ffffff`), clean checkbox outlines, and fine hairlines. Designed to look sharp on any black-and-white laser printer or inkjet without burning through ink cartridges.
- **Handwriting Ruled Lines**: Every section features customizable blank lines (`[-] [count] [+]`) with an empty checkbox so you or your partner can write in additional tasks with a pen as you work through the house.
- **Multiple Print Layouts**:
  - **Full Page (Letter & A4)**: Generous full-sheet checklist with 1-column or balanced 2-column density options.
  - **Half-Sheet (2-Up)**: Prints two `5.5" × 8.5"` mini notepads side-by-side in landscape format with a dashed cutting line (`✂ CUT HERE ✂`). Includes toggles for:
    - *Split Sections*: Section 1–2 on the left, Section 3–4 on the right.
    - *Twin Copies*: Two identical copies of your list side-by-side to slice in half (give one to a partner or keep a backup).
- **Blank Template Mode**: With one click in the toolbar, switch from "Filled Tasks" to "Blank Template" to print empty, pre-titled ruled checklists for pure pen-and-paper use.
- **Multi-List Management**: Save and switch between multiple checklists (e.g., *Home Maintenance*, *Weekend Blitz*, *Garage & Workshop*). Everything auto-saves instantly to browser `localStorage`.
- **Markdown & JSON Export/Import**: Export your lists to GitHub Flavored Markdown (`- [ ]`) to paste in notes, or backup/restore entire workspaces via JSON.
- **Keyboard-First Workflow**:
  - Press <kbd>Enter</kbd> to instantly create and jump to the next task.
  - Press <kbd>Backspace</kbd> on an empty task to delete it and move focus to the previous task.
  - Press <kbd>⌘P</kbd> or <kbd>Ctrl+P</kbd> to open the system print dialog.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (or `npm` / `yarn`)

### Installation

```bash
# Clone the repository
git clone https://github.com/johnstansbury/honey-do.git
cd honey-do

# Install dependencies
pnpm install
```

### Development Server

Start the local development server:

```bash
pnpm run dev
```

Open [http://localhost:5174/](http://localhost:5174/) (or the port shown in your terminal) in your browser.

### Building for Production

Compile TypeScript and build the optimized production bundle:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

---

## 🖨️ Recommended Print Settings

When printing from Chrome, Safari, Edge, or Firefox:

| Setting | Recommended Value |
| :--- | :--- |
| **Destination** | Save as PDF or your physical printer |
| **Paper Size** | **US Letter** (8.5 × 11 in) or **A4** (matching your toolbar setting) |
| **Orientation** | **Portrait** (Full Page) or **Landscape** (Half-Sheet 2-Up) |
| **Margins** | **Default** or **Minimum** |
| **Headers & Footers** | **Disabled** (Honey-Do renders its own clean date & quote header/footer) |
| **Background Graphics** | Optional (styles are built purely with CSS borders and lines for zero ink waste) |

---

## 📁 Project Structure

```
honey-do/
├── index.html                   # HTML entry point with Inter & JetBrains Mono fonts
├── package.json                 # Project configuration and scripts
├── tsconfig.json                # TypeScript project configuration
├── vite.config.ts               # Vite build configuration
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root state management & LocalStorage sync
│   ├── types.ts                 # TypeScript interfaces for lists, sections, & tasks
│   ├── defaultLists.ts          # Default Honey-Do templates and list factory
│   ├── index.css                # Minimal monochrome design system & @media print CSS
│   └── components/
│       ├── PaperSheet.tsx       # WYSIWYG paper canvas & 2-Up half-sheet renderer
│       ├── SectionBlock.tsx     # Section cards, tasks list, & blank ruled lines
│       ├── Toolbar.tsx          # Print triggers, layout toggles, & mode switches
│       ├── Sidebar.tsx          # Multi-list drawer, template selector, & actions
│       └── ExportImportModal.tsx# Markdown/JSON export and import dialog
└── LICENSE                      # MIT License
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///Users/johnstansbury/Code/honey-do/LICENSE) file for details.
