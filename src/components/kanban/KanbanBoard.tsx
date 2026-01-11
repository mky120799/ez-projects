import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useKanban } from "../hooks/useKanban";
import { Column } from "./KanbanColumn";
import "./kanban.styles.css";

export const KanbanBoard = () => {
  const kanban = useKanban();
  const [activeCard, setActiveCard] = useState<{
    columnId: string;
    cardId: string;
    title: string;
  } | null>(null);

  const handleDragStart = (e: DragStartEvent) => {
    const [columnId, cardId] = String(e.active.id).split(":");

    const column = kanban.board.find((c) => c.id === columnId);
    const card = column?.cards.find((c) => c.id === cardId);

    if (card) {
      setActiveCard({ columnId, cardId, title: card.title });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    kanban.onDragEnd(String(active.id), String(over.id));
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {kanban.board.map((col) => (
          <Column
            key={col.id}
            column={col}
            onAddCard={kanban.addCard}
            onEditCard={kanban.editCard}
            onDeleteCard={kanban.deleteCard}
          />
        ))}
      </div>

      {/*  THIS IS THE MAIN LOGIC OF THE PROJECT */}
      <DragOverlay>
        {activeCard ? (
          <div className="kanban-card kanban-card--overlay">
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
