import { useEffect, useState } from "react";
import Terminal from "./components/Terminal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import FileTree from "./components/Tree";
import socket from "./socket";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [fileTree, setFileTree] = useState({});

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  return (
    <>
      <div className="h-8 bg-green-300  flex items-center">
        <img src="/web-ide_logo.png" alt="web-ide-logo" className="w-13 ml-2" />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="border border-t-2 border-green-300 min-h-[94vh] dark:bg-gray-200 bg-black text-white"
      >
        <ResizablePanel
          defaultSize={20}
          className="border-r border-green-300 pl-5 text-sm"
        >
          <FileTree
            onSelect={(path) => console.log("Select: ", path)}
            tree={fileTree}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="w-full h-full">
                <AceEditor
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                  mode="javascript"
                  theme="monokai"
                  name="ace-editor"
                  editorProps={{ $blockScrolling: true }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={30}
              className="border-t border-green-600"
            >
              <div>
                <Terminal />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default App;
