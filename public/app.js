const socket = io();
let myId = "";
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) {
    return;
  }
  socket.emit("chat-message", text);
  messageInput.value = "";
});

// socket.on("chat-message", (data) => {
//   myId = socket.id;
//   const div = document.createElement("div");
//   div.className = "message";
//   div.innerText = `${data.id}: ${data.text}`;
//   messages.appendChild(div);
//   messages.scrollTop = message.scrollHeight;
// });
socket.on("connect", () => {
  myId = socket.id;
  console.log("My ID:", myId);
});
socket.on("chat-message", (data) => {
  const div = document.createElement("div");

  div.classList.add("message");

  if (data.id === myId) {
    div.classList.add("my-message");
  } else {
    div.classList.add("other-message");
  }

  div.textContent = data.text;

  messages.appendChild(div);
});
