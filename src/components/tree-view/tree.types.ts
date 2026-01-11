export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[]; // undefined = not loaded yet
  isExpanded?: boolean;
  isLoading?: boolean;
}
