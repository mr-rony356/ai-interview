export interface TreeItem {
  name: string;
  description: string;
  type: "file" | "folder";
  children?: TreeItem[];
  isEmpty?: boolean;
}
