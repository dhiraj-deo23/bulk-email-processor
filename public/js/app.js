const upload = document.querySelector("#upload");

const template = (mail, log) => {
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerText = `sent to: ${mail} at time: ${log}`;
  div.appendChild(p);
  upload.insertAdjacentElement("afterend", div);
};

const socket = new WebSocket(`ws://localhost:3000`);

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to WS Server");
});

socket.addEventListener("message", async (event) => {
  const data = await event.data.text();
  const logdata = JSON.parse(data);
  console.log(logdata);
  if (logdata) {
    template(logdata.mail, logdata.log);
  }
});
