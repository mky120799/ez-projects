import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { TreeNode } from "./tree.types";
import "./tree.styles.css";

interface TreeApi {
  toggleExpand: (id: string, node: TreeNode) => void;
  editName: (id: string, name: string) => void;
  addChild: (id: string, name: string) => void;
  removeNode: (id: string) => void;
}

interface Props {
  node: TreeNode;
  treeApi: TreeApi;
  isLast?: boolean;
  depth?: number;
}

export const TreeNodeItem = ({
  node,
  treeApi,
  isLast = false,
  depth = 0,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
  });

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.isExpanded && hasChildren;

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setDropRef}
      className={`tree-node ${isLast ? "tree-node-last" : ""} ${
        depth > 0 ? "tree-node-child" : ""
      }`}
    >
      {/* Tree connecting lines */}
      {depth > 0 && (
        <div className="tree-node-lines">
          {/* Draw vertical lines for each parent level */}
          {Array.from({ length: depth }).map((_, level) => {
            const lineLeft = -(level + 1) * 20;
            const isImmediateParent = level === depth - 1;
            // Only the immediate parent's line stops for last child
            const shouldStop = isLast && isImmediateParent;
            return (
              <div
                key={level}
                className={`tree-node-line-vertical ${
                  shouldStop ? "tree-node-line-last" : ""
                }`}
                style={{
                  left: `${lineLeft}px`,
                }}
              />
            );
          })}
          {/* Horizontal connector line */}
          <div
            className="tree-node-line-horizontal"
            style={{
              left: `${-depth * 20 + 1}px`, // Start from the center of the vertical line
            }}
          />
        </div>
      )}

      <div className="tree-node-content" style={style}>
        <div
          className="tree-node-body"
          style={{
            background: isOver ? "#e6f0ff" : "transparent",
          }}
        >
          {/* Expand */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              treeApi.toggleExpand(node.id, node);
            }}
            className="tree-node-expand"
            style={{ cursor: hasChildren ? "pointer" : "default" }}
          >
            {hasChildren ? (isExpanded ? "▼" : "▶") : " "}
          </span>

          {/* Drag handle */}
          <span
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="tree-node-drag-handle"
            style={{ cursor: "grab" }}
          >
            ⠿
          </span>

          {/* Name */}
          {isEditing ? (
            <input
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                treeApi.editName(node.id, name);
                setIsEditing(false);
              }}
              className="tree-node-input"
            />
          ) : (
            <span
              onDoubleClick={() => setIsEditing(true)}
              className="tree-node-name"
            >
              {node.name}
            </span>
          )}

          <button
            onClick={() => treeApi.addChild(node.id, "New Node")}
            className="tree-node-button"
          >
            ➕
          </button>
          <button
            onClick={() => treeApi.removeNode(node.id)}
            className="tree-node-button"
          >
            ❌
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="tree-node-children">
          {node.children?.map((child, index) => {
            const isLastChild = index === node.children!.length - 1;
            return (
              <TreeNodeItem
                key={child.id}
                node={child}
                treeApi={treeApi}
                isLast={isLastChild}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
