import { Terminal as XTermianl } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from "../socket";

const Terminal = () => {
  const termianlRef = useRef(null);
  const isRender = useRef(false);

  useEffect(() => {
    if (isRender.current) return;
    isRender.current = true;
    const term = new XTermianl({
      rows: 9,
      theme: {
        background: "#000505",
        foreground: "#ffffff",
        cursor: "#7bf1a2",
      },
    });
    term.open(termianlRef.current);

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    function onTerminalData(data) {
      term.write(data);
    }

    socket.on("terminal:data", onTerminalData);

    // return () => {
    //   socket.off("terminal:data", onTerminalData);
    // };
  }, []);
  return <div ref={termianlRef} id="terminal"></div>;
};

export default Terminal;
