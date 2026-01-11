import type { TreeNode } from "./tree.types";

/* 
   UPDATE NODE (generic recursive updater)
 */
export const updateNode = (
  nodes: TreeNode[],
  nodeId: string,
  updater: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updater(node);
    }

    if (node.children) {
      return {
        ...node,
        children: updateNode(node.children, nodeId, updater),
      };
    }

    return node;
  });
};

/* 
   DELETE NODE (remove subtree)
 */
export const deleteNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: node.children ? deleteNode(node.children, nodeId) : undefined,
    }));
};

/* 
   EDIT NODE NAME
 */
export const editNodeName = (
  nodes: TreeNode[],
  nodeId: string,
  name: string
): TreeNode[] => {
  return updateNode(nodes, nodeId, (node) => ({
    ...node,
    name,
  }));
};

/*
   ADD CHILD NODE
 */
export const addChildNode = (
  nodes: TreeNode[],
  parentId: string,
  child: TreeNode
): TreeNode[] => {
  return updateNode(nodes, parentId, (node) => ({
    ...node,
    isExpanded: true,
    children: [...(node.children || []), child],
  }));
};

/* 
   DRAG & DROP HELPERS
 */

/* Remove a node and return it */
export const removeNodeById = (
  nodes: TreeNode[],
  id: string
): { node: TreeNode | null; tree: TreeNode[] } => {
  let removedNode: TreeNode | null = null;

  const traverse = (items: TreeNode[]): TreeNode[] =>
    items
      .filter((item) => {
        if (item.id === id) {
          removedNode = item;
          return false;
        }
        return true;
      })
      .map((item) => ({
        ...item,
        children: item.children ? traverse(item.children) : undefined,
      }));

  return {
    node: removedNode,
    tree: traverse(nodes),
  };
};

/* Insert node under parent (or root if null) */
export const insertNode = (
  nodes: TreeNode[],
  parentId: string | null,
  node: TreeNode
): TreeNode[] => {
  if (!parentId) {
    return [...nodes, node];
  }

  return nodes.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        isExpanded: true,
        children: [...(item.children || []), node],
      };
    }

    return {
      ...item,
      children: item.children
        ? insertNode(item.children, parentId, node)
        : undefined,
    };
  });
};

/* 
   DRAG & DROP: FIND PARENT & INDEX
*/
export const findParentAndIndex = (
  nodes: TreeNode[],
  id: string,
  parent: TreeNode | null = null
): { parent: TreeNode | null; index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { parent, index: i };
    }
    if (nodes[i].children) {
      const res = findParentAndIndex(nodes[i].children!, id, nodes[i]);
      if (res) return res;
    }
  }
  return null;
};

/* 
   DRAG & DROP: CHECK IF NODE IS DESCENDANT
 */
const isDescendant = (
  nodes: TreeNode[],
  ancestorId: string,
  descendantId: string
): boolean => {
  // Helper to check if any descendant (not the node itself) matches descendantId
  const containsDescendant = (node: TreeNode): boolean => {
    if (node.children) {
      // Check direct children
      if (node.children.some((child) => child.id === descendantId)) {
        return true;
      }
      // Recursively check grandchildren and beyond
      return node.children.some(containsDescendant);
    }
    return false;
  };

  // Find the ancestor node and check if it contains the descendant in its subtree
  for (const node of nodes) {
    if (node.id === ancestorId) {
      return containsDescendant(node);
    }
    if (node.children) {
      if (isDescendant(node.children, ancestorId, descendantId)) {
        return true;
      }
    }
  }
  return false;
};

/* 
   DRAG & DROP: MOVE NODE (REORDER / REPARENT)
 */
export const moveNode = (
  tree: TreeNode[],
  activeId: string,
  overId: string
): TreeNode[] => {
  // Prevent moving a node into itself or its descendants
  if (activeId === overId) return tree;

  const clone = structuredClone(tree);

  // Check if trying to move into own descendant
  if (isDescendant(clone, activeId, overId)) {
    return tree; // Invalid move, return unchanged
  }

  const from = findParentAndIndex(clone, activeId);
  const to = findParentAndIndex(clone, overId);

  if (!from || !to) return tree;

  const fromList = from.parent ? from.parent.children! : clone;
  const toList = to.parent ? to.parent.children! : clone;

  // Remove the node from its current position
  const [moved] = fromList.splice(from.index, 1);

  // Same parent → reorder within the same level
  if (from.parent?.id === to.parent?.id) {
    // Calculate correct insert index accounting for the removed item
    // Standard behavior: drop on target = insert at target's position (before target)
    let insertIndex = to.index;
    if (from.index < to.index) {
      // Moving forward: after removing from.index, target shifted left to (to.index - 1)
      // Insert at target's new position to place before it
      insertIndex = to.index - 1;
    } else {
      // Moving backward: target still at to.index, insert before it
      insertIndex = to.index;
    }
    toList.splice(insertIndex, 0, moved);
  } else {
    // Different parent → make it a child of the target node
    // Find the target node and add moved node to its children
    const findAndAddChild = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === overId) {
          return {
            ...node,
            isExpanded: true,
            children: [...(node.children || []), moved],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: findAndAddChild(node.children),
          };
        }
        return node;
      });
    };
    return findAndAddChild(clone);
  }

  return clone;
};
