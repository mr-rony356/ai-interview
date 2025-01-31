"use client";

import { TreeItem } from "@/common/type";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { useState } from "react";

export function TreeNode({ item }: { item: TreeItem }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <div className="flex items-center gap-1 py-1">
        {item.type === "folder" && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {hasChildren && !item.isEmpty ? (
              isOpen ? (
                <ChevronDown className="h-6 w-6" />
              ) : (
                <ChevronRight className="h-6 w-6" />
              )
            ) : null}
          </button>
        )}
        {item.type === "folder" ? (
          <Folder className="h-6 w-6 text-gray-400" />
        ) : (
          <File className="h-6 w-6 text-gray-400" />
        )}
        <span className="text-md text-gray-700">{item.name}</span>
        <span className="text-xs text-gray-400">{item.description}</span>
      </div>
      {hasChildren && isOpen && !item.isEmpty && (
        <ul className="ml-6 border-l border-gray-200 pl-2">
          {item?.children?.map((child, index) => (
            <TreeNode key={index} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
