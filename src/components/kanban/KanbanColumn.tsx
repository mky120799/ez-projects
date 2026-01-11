import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { KanbanColumn } from "./kanban.types";
import { Card } from "./KanbanCard";
import { useState } from "react";

interface Props {
  column: KanbanColumn;
  onAddCard: (columnId: string, title: string) => void;
  onEditCard: (columnId: string, cardId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export const Column = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: Props) => {
  const [title, setTitle] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "kanban-column--over" : ""}`}
    >
      <h3 className="kanban-column-title">{column.title}</h3>

      <input
        value={title}
        placeholder="Add card..."
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="add-button"
        onClick={() => {
          if (!title.trim()) return;
          onAddCard(column.id, title);
          setTitle("");
        }}
      >
        Add
      </button>
      <SortableContext
        items={column.cards.map((c) => `${column.id}:${c.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}
      </SortableContext>
    </div>
  );
};
