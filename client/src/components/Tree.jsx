const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
    >
      <p
        style={{ marginLeft: "10px", marginTop: "2px" }}
        className={`${
          isDir
            ? "hover:bg-green-700/70"
            : "hover:bg-green-400/30 cursor-pointer"
        }`}
      >
        {isDir ? "🗁 " : "🗎 "}
        {fileName}
      </p>
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li
              key={child}
              style={{ marginLeft: "12px" }}
              className="outline-none"
            >
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
    <>
      <FileTreeNode fileName="/" nodes={tree} path="" onSelect={onSelect} />
    </>
  );
};

export default FileTree;
