import { useState } from "react";

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  const [open, setOpen] = useState(false);

  const toggle = (e) => {
    e.stopPropagation();
    if (isDir) {
      setOpen(!open);
    } else {
      onSelect(path);
    }
  };

  return (
    <div style={{ userSelect: "none" }}>
      <p
        onClick={toggle}
        className={`${
          isDir
            ? "hover:bg-green-700/70 cursor-pointer"
            : "hover:bg-green-400/30 cursor-pointer"
        }`}
        style={{ paddingLeft: "10px", paddingTop: "2px" }}
      >
        {isDir ? (open ? "⌄ 🗁 " : "˃ 🗀 ") : "🗎 "}
        {fileName}
      </p>

      {isDir && open && (
        <ul style={{ paddingLeft: "16px" }}>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                fileName={child}
                nodes={nodes[child]}
                path={path + "/" + child}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  return (
    <div className="pt-2">
      <FileTreeNode fileName="/" nodes={tree} path="" onSelect={onSelect} />
    </div>
  );
};

export default FileTree;
