# EZ Projects – Tree View & Kanban Board
👉 access the live link [EZ- Project](https://ez-projects.onrender.com).

## A React + TypeScript project built with Vite that demonstrates two commonly used UI patterns:

-  **Tree View** (hierarchical data visualization)
-  **Kanban Board** (task management with drag & drop)

The app uses client-side routing to navigate between features and modern libraries for smooth UX.

---

##  Features

### Tree View
- Recursive tree structure
- Expand / collapse nodes
- Add & remove nodes
- Clean, scalable folder structure

### Kanban Board
- Multiple columns
- Add / edit / delete cards
- Drag & drop cards
  - Reorder within a column
  - Move cards across columns
- Smooth drag animations using **@dnd-kit**

### General
- React Router based navigation
- Custom hooks for business logic
- Mock API layer
- Type-safe with TypeScript
- Modular, industry-style folder structure

---

##  Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **React Router DOM**
- **@dnd-kit**
- **CSS (no UI library)**

---

##  Folder Structure

```

/Users/mky1207/Desktop/practice projects/ez-projects/
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├─] node_modules/ (ignored)
├── package-lock.json
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── hooks/
│   │   │   ├── useKanban.ts
│   │   │   └── useTree.ts
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── kanban.mock.ts
│   │   │   ├── kanban.styles.css
│   │   │   ├── kanban.types.ts
│   │   │   └── kanban.utils.ts
│   │   ├── services/
│   │   │   └── mockApi.ts
│   │   └── tree-view/
│   │       ├── TreeNodeItem.tsx
│   │       ├── TreeView.tsx
│   │       ├── tree.mock.ts
│   │       ├── tree.styles.css
│   │       ├── tree.types.ts
│   │       └── tree.utils.ts
│   ├── index.css
│   └── main.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```


---

## 🛠️ Installation & Setup

```
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build

```


##  Key Librarie

-	react-router-dom – client-side routing
-	@dnd-kit/core & @dnd-kit/sortable – drag & drop
-	@dnd-kit/utilities – animations & transforms


##  Architecture Notes
-	UI components are kept dumb
-	Business logic lives in custom hooks
-	State updates are immutable
-	Drag & drop logic is centralized
-	Designed to be easily extensible

##  Future Improvements
-	Persist data (localStorage / backend)
-	Drag & drop columns
-	Keyboard accessibility
-	Tree node drag & drop
-	Better mobile support

## License

- This project is for learning and practice purposes.
