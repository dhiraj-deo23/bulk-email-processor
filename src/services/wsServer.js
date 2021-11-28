const WebSocket = require("ws");

const wsServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
      console.log(JSON.parse(message));
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
};

module.exports = {
  wsServer,
};
