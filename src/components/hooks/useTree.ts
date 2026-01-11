import { useState } from "react";
import type { TreeNode } from "../tree-view/tree.types";
import { initialTree } from "../tree-view/tree.mock";
import { fetchChildren } from "../services/mockApi.ts";
import {
  updateNode,
  deleteNode,
  editNodeName,
  addChildNode,
  moveNode,
} from "../tree-view/tree.utils.ts";

export const useTree = () => {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);

  const toggleExpand = async (id: string, node: TreeNode) => {
    if (!node.isExpanded && node.children === undefined) {
      setTree((prev) =>
        updateNode(prev, id, (n) => ({ ...n, isLoading: true }))
      );

      const children = await fetchChildren(id);

      setTree((prev) =>
        updateNode(prev, id, (n) => ({
          ...n,
          isExpanded: true,
          isLoading: false,
          children,
        }))
      );
    } else {
      setTree((prev) =>
        updateNode(prev, id, (n) => ({
          ...n,
          isExpanded: !n.isExpanded,
        }))
      );
    }
  };

  const addChild = (parentId: string, name: string) => {
    setTree((prev) =>
      addChildNode(prev, parentId, {
        id: crypto.randomUUID(),
        name,
      })
    );
  };

  const editName = (id: string, name: string) => {
    setTree((prev) => editNodeName(prev, id, name));
  };

  const removeNode = (id: string) => {
    setTree((prev) => deleteNode(prev, id));
  };

  const moveNodeHandler = (activeId: string, overId: string) => {
    setTree((prev) => moveNode(prev, activeId, overId));
  };

  return {
    tree,
    toggleExpand,
    addChild,
    editName,
    removeNode,
    moveNode: moveNodeHandler,
  };
};
