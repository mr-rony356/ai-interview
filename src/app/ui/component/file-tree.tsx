import { TreeItem } from "@/common/type";
import { TreeNode } from "./tree-node";

const treeData: TreeItem[] = [
  {
    name: "Images",
    description: "description",
    type: "folder",
    isEmpty: true,
  },
  {
    name: "CSS",
    description: "description",
    type: "folder",
    children: [
      { name: "file name", description: "description", type: "file" },
      { name: "file name", description: "description", type: "file" },
    ],
  },
  {
    name: "HTML",
    description: "description",
    type: "folder",
    children: [
      {
        name: "PAGES",
        description: "description",
        type: "folder",
        children: [
          { name: "file name", description: "description", type: "file" },
          { name: "file name", description: "description", type: "file" },
          { name: "file name", description: "description", type: "file" },
        ],
      },
      { name: "file name", description: "description", type: "file" },
      { name: "file name", description: "description", type: "file" },
    ],
  },
  { name: "index.html", description: "description", type: "file" },
  { name: "components.html", description: "description", type: "file" },
];

export default function FileTree() {
  return (
    <div className="rounded-sm bg-white border p-4 shadow-md">
      <ul className="space-y-1">
        {treeData.map((item, index) => (
          <TreeNode key={index} item={item} />
        ))}
      </ul>
    </div>
  );
}
