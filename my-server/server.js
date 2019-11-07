const express = require("express");
const app = express();
const fs = require("fs");
const socketIo = require("socket.io");
const PORT = 80;

app.get("/", (req, res) => {
  fs.readFile("client.html", (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(data.toString());
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`PORT ${PORT}`);
});

const io = socketIo(server);
io.on("connection", socket => {
  socket.on("new-chat-from-client", data => {
    io.emit("new-chat-from-server", {
      msg: data.msg,
      name: socket.id.substring(0, 5),
      socketId: socket.id
    });
  });
  socket.emit("init", {
    socketId: socket.id,
    name: socket.id.substring(0, 5)
  });
});
