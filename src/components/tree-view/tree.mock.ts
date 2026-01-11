import type { TreeNode } from "./tree.types";

export const initialTree: TreeNode[] = [
  {
    id: "1",
    name: "Applications",
  },
  {
    id: "2",
    name: "Documents",
  },
  {
    id: "3",
    name: "Downloads",
  },
];

export const lazyChildrenMap: Record<string, TreeNode[]> = {
  "1": [
    { id: "1-1", name: "Chrome" },
    { id: "1-2", name: "VS Code" },
    { id: "1-3", name: "Firefox" },
  ],
  "2": [
    { id: "2-1", name: "Invoices" },
    { id: "2-2", name: "Reports" },
  ],
};
