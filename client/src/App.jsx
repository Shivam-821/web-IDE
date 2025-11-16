import { useState } from "react";
import Terminal from "./components/Terminal";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="min-h-[60vh] flex">
        <div>File-structrue</div>
        <div>Editor</div>
      </div>
      <div>
        <Terminal />
      </div>
    </div>
  );
}

export default App;
