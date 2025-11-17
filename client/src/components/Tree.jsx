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
        style={{ paddingLeft: "10px", paddingTop: "2px" }}
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
        <ul style={{ paddingLeft: "12px" }}>
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
    <>
      <FileTreeNode fileName="/" nodes={tree} path="" onSelect={onSelect} />
    </>
  );
};

export default FileTree;
