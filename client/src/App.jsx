import { useEffect, useState } from "react";
import Terminal from "./components/Terminal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FileTree from "./components/Tree";

function App() {
  const [fileTree, setFileTree] = useState({});

  const getFileTree = () => async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  return (
    <>
      <div className="h-8 bg-green-300  flex items-center">
        <img src="/web-ide_logo.png" alt="" className="w-13 ml-2" />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="border border-t-2 border-green-300 md:min-h-[94vh] dark:bg-gray-200 bg-black text-white"
      >
        <ResizablePanel defaultSize={20} className="border-r border-green-300">
          <div>
            <FileTree tree={fileTree} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
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
