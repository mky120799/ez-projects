import { DndContext, type DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { useTree } from "../hooks/useTree.ts";
import type { TreeNode } from "./tree.types.ts";
import { TreeNodeItem } from "./TreeNodeItem.tsx";
export const TreeView = () => {
  const treeApi = useTree();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;
    treeApi.moveNode(String(active.id), String(over.id));
  };

  return (
    <DndContext
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
    >
      {treeApi.tree.map((node: TreeNode, index) => {
        const isLast = index === treeApi.tree.length - 1;
        return (
          <TreeNodeItem
            key={node.id}
            node={node}
            treeApi={treeApi}
            isLast={isLast}
            depth={0}
          />
        );
      })}

      <DragOverlay>
        {activeId ? <div style={{ padding: 6 }}>Dragging…</div> : null}
      </DragOverlay>
    </DndContext>
  );
};
