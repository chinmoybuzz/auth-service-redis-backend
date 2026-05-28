import { Server } from "socket.io";
import _ from "lodash";

let io;

function socketInitialize(server) {
  console.log("object");
  io = new Server(server, {
    cors: {
      origin: "*",
      // methods: ["GET", "POST", "PUT", "DELETE"],
      // credentials: false,
    },
  });
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("chat-message", (message) => {
      console.log("message", message);
      io.emit("chat-message", {
        id: socket.id,
        text: message,
      });
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Io not initialize, initialize with initialize()");
  }
}

export { getIo, socketInitialize };
