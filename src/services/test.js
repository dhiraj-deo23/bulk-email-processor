const WebSocket = require("ws");
const socket = new WebSocket("ws://localhost:3000");

const sendMessage = (msg) => {
  // Connection opened
  socket.on("open", function (event) {
    console.log("test", msg);
    socket.send(msg);
  });
};

module.exports = sendMessage;
