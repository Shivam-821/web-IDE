import { Terminal as XTermianl } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const termianlRef = useRef(null);
  const isRender = useRef(false);

  useEffect(() => {
    if (isRender.current) return;
    isRender.current = true;
    const term = new XTermianl({
      rows: 20,
      theme: "black",
    });
    term.open(termianlRef.current);

    term.onData((data) => console.log(data));
  }, []);
  return <div ref={termianlRef} id="terminal"></div>;
};

export default Terminal;
