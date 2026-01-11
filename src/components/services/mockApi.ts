import { lazyChildrenMap } from "../tree-view/tree.mock";

export const fetchChildren = async (nodeId: string) => {
  await new Promise((res) => setTimeout(res, 800));
  return lazyChildrenMap[nodeId] || [];
};
