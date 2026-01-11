import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { initialBoard } from "../kanban/kanban.mock";
import type { KanbanColumn } from "../kanban/kanban.types";

export const useKanban = () => {
  const [board, setBoard] = useState<KanbanColumn[]>(initialBoard);

  const addCard = (columnId: string, title: string) => {
    setBoard((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [...col.cards, { id: crypto.randomUUID(), title }],
            }
          : col
      )
    );
  };

  const editCard = (columnId: string, cardId: string, title: string) => {
    setBoard((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId ? { ...c, title } : c
              ),
            }
          : col
      )
    );
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setBoard((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  const onDragEnd = (activeId: string, overId: string) => {
    const [fromColId, cardId] = activeId.split(":");

    // Check if overId is a column ID (no colon) or a card ID (has colon)
    const isDroppingOnColumn = !overId.includes(":");
    const toColId = isDroppingOnColumn ? overId : overId.split(":")[0];
    const targetCardId = isDroppingOnColumn ? null : overId.split(":")[1];

    if (!fromColId || !toColId || !cardId) return;

    setBoard((prev) => {
      if (fromColId === toColId) {
        // 🔁 Reorder inside same column
        const column = prev.find((c) => c.id === fromColId);
        if (!column) return prev;

        // If dropping on a card, reorder to that position
        if (targetCardId) {
          const oldIndex = column.cards.findIndex((c) => c.id === cardId);
          const newIndex = column.cards.findIndex((c) => c.id === targetCardId);

          if (oldIndex === -1 || newIndex === -1) return prev;

          return prev.map((col) =>
            col.id === fromColId
              ? { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
              : col
          );
        }
        // If dropping on column itself, no reorder needed
        return prev;
      }

      // 🔀 Move across columns
      const sourceColumn = prev.find((c) => c.id === fromColId);
      const targetColumn = prev.find((c) => c.id === toColId);

      if (!sourceColumn || !targetColumn) return prev;

      const movingCard = sourceColumn.cards.find((c) => c.id === cardId);
      if (!movingCard) return prev;

      // If dropping on a specific card, insert before it
      if (targetCardId) {
        const targetIndex = targetColumn.cards.findIndex(
          (c) => c.id === targetCardId
        );

        return prev.map((col) => {
          if (col.id === fromColId) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== cardId),
            };
          }

          if (col.id === toColId) {
            const newCards = [...col.cards];
            if (targetIndex !== -1) {
              newCards.splice(targetIndex, 0, movingCard);
            } else {
              newCards.push(movingCard);
            }
            return {
              ...col,
              cards: newCards,
            };
          }

          return col;
        });
      }

      // Dropping on column itself - add to end
      return prev.map((col) => {
        if (col.id === fromColId) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== cardId),
          };
        }

        if (col.id === toColId) {
          return {
            ...col,
            cards: [...col.cards, movingCard],
          };
        }

        return col;
      });
    });
  };

  return {
    board,
    addCard,
    editCard,
    deleteCard,
    onDragEnd,
  };
};
