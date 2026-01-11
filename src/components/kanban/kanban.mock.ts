import type { KanbanColumn } from "./kanban.types";

export const initialBoard: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "1", title: "Setup project" },
      { id: "2", title: "Design UI" },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    cards: [{ id: "3", title: "Kanban CRUD" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "4", title: "Tree View" }],
  },
];
