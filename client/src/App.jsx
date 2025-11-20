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

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/worker-javascript";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [path, setPath] = useState("");

  const isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContent = async () => {
    if (!selectedFilePath) return;
    console.log("reached to call");
    const response = await fetch(
      `http://localhost:9000/files/content?path=${path}`
    );
    const result = await response.json();
    console.log(result);
    setSelectedFileContent(result.content);
  };

  // debouncing
  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", { path: path, content: code });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFilePath, isSaved]);

  useEffect(() => {
    setCode("");
  }, [selectedFilePath]);

  useEffect(() => {
    if (selectedFilePath) {
      getFileContent();
    }
  }, [selectedFilePath]);

  useEffect(() => {
    if (selectedFilePath && selectedFileContent) {
      setCode(selectedFileContent);
    }
  }, [selectedFilePath, selectedFileContent]);

  useEffect(() => {
    getFileTree();
  }, []);

  // when any change is being done in file tree, like creation or deletion
  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  return (
    <>
      <div className="h-7.5 bg-green-300  flex items-center">
        <img src="/web-ide_logo.png" alt="web-ide-logo" className="w-13 ml-2" />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="border border-t-2 border-green-300 min-h-[94.5vh] dark:bg-gray-200 bg-black text-white"
      >
        <ResizablePanel
          defaultSize={20}
          className="border-r border-green-300 pl-5 text-sm"
        >
          <FileTree
            onSelect={(path) => {
              setPath(path);
              setSelectedFilePath(String(path).replaceAll("/", " > "));
            }}
            tree={fileTree}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <div className="w-full h-full">
                {selectedFilePath && (
                  <p
                    style={{ paddingLeft: "2px", paddingRight: "6px" }}
                    className="bg-green-200/10 h-4.5 text-[11px] text-green-700 flex justify-between"
                  >
                    {selectedFilePath}
                    <span className="text-amber-200">
                      {isSaved ? "◉ Saved" : "◎ Unsaved"}
                    </span>
                  </p>
                )}
                <AceEditor
                  width="100%"
                  height="100%"
                  mode="javascript"
                  theme="twilight"
                  name="ace-editor"
                  value={code}
                  onChange={(e) => setCode(e)}
                  setOptions={{ useWorker: false }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={35}
              className="border-t border-green-600"
            >
              <div
                style={{ paddingLeft: "5px" }}
                className="bg-green-700/40 text-[9px] border-t border-green-600/60 font-sans text-green-100"
              >
                TERMINAL
              </div>
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
