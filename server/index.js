const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const fs = require("fs/promises");
const pty = require("node-pty");
const path = require("path");
const cors = require("cors");
const chokidar = require("chokidar");

// terminal executioon
var ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env,
});

// dependencies
const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});
app.use(
  cors({
    origin: "*",
  })
);

io.attach(server);

// for any change in file structure
chokidar.watch("./user").on("all", (event, path) => {
  io.emit("file:refresh", path);
});

// send-back the output of user terminal input
ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

// connecting to the websocket server
io.on("connection", (socket) => {
  console.log("socket connected: ", socket.id);

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });

  socket.on("file:change", async ({ path, content }) => {
    await fs.writeFile(`./user${path}`, content);
  });
});

// route to fetch the file structure
app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree("./user");
  return res.json({ tree: fileTree });
});

// route to fetch the content of the file
app.get("/files/content", async (req, res) => {
  const path = req.query.path;
  const content = await fs.readFile(`./user${path}`, "utf-8");
  return res.json({ content });
});

app.get("/initial-execution", async (req, res) => {
  let output = "";

  // Temporary listener
  const listener = (data) => {
    output += data;
  };
  ptyProcess.onData(listener);

  ptyProcess.write("clear\n");

  // Wait a short time to collect output
  setTimeout(() => {
    ptyProcess.removeListener("data", listener);
    res.json({ output });
  }, 200);
});

// listening to the server
server.listen(9000, () => console.log(`🐋 Docker server running on port 9000`));

// helper function to generate the file structure
async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);

  return tree;
}
