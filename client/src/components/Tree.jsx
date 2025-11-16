
const FileTreeNode = ({ fileName, nodes }) => {
    return (
        <div>
            {fileName}
            {nodes && <ul>
                {Object.keys(nodes).map(child => {
                    <li>
                        <FileTreeNode fileName={child} nodes={nodes[child]}/>
                    </li>
                }) }
            </ul>}
        </div>
    )
}

const FileTree = ({tree}) => {
    return (
        <FileTree
            fileName="/"
            nodes={tree} />

    )
}

export default FileTree