import type { KanbanColumn } from "./kanban.types";

export const moveCard = (
  board: KanbanColumn[],
  activeId: string,
  overId: string
) => {
  const next = structuredClone(board);

  const [fromColId, cardId] = activeId.split(":");
  const [toColId, overCardId] = overId.split(":");

  const fromCol = next.find((c) => c.id === fromColId)!;
  const toCol = next.find((c) => c.id === toColId)!;

  const fromIndex = fromCol.cards.findIndex((c) => c.id === cardId);
  const [moved] = fromCol.cards.splice(fromIndex, 1);

  if (fromColId === toColId) {
    const toIndex = toCol.cards.findIndex((c) => c.id === overCardId);
    toCol.cards.splice(toIndex, 0, moved);
  } else {
    toCol.cards.push(moved);
  }

  return next;
};
