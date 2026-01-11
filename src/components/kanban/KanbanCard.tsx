import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { KanbanCard } from "./kanban.types";

interface Props {
  card: KanbanCard;
  columnId: string;
  onEdit: (columnId: string, cardId: string, title: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
}

export const Card = ({ card, columnId, onEdit, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${columnId}:${card.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`kanban-card ${isDragging ? "kanban-card--dragging" : ""}`}
      style={style}
    >
      <span {...attributes} {...listeners} className="kanban-drag-handle">
        ⠿
      </span>

      {isEditing ? (
        <input
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            onEdit(columnId, card.id, title);
            setIsEditing(false);
          }}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)}>{card.title}</span>
      )}

      <button
        className="kanban-card-delete"
        onClick={() => onDelete(columnId, card.id)}
      >
        ❌
      </button>
    </div>
  );
};
