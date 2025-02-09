import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ nickname, room }) => {
    socket.join(room);
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room).add(nickname);

    io.to(room).emit("user_joined", {
      nickname,
      users: Array.from(rooms.get(room)),
    });
  });

  socket.on("leave_room", ({ nickname, room }) => {
    socket.leave(room);
    if (rooms.has(room)) {
      rooms.get(room).delete(nickname);
      if (rooms.get(room).size === 0) {
        rooms.delete(room);
      } else {
        io.to(room).emit("user_left", {
          nickname,
          users: Array.from(rooms.get(room)),
        });
      }
    }
  });

  socket.on("send_message", (data) => {
    // Broadcast to everyone except the sender to avoid duplicate messages
    socket.broadcast.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Optionally, remove the user from any rooms if necessary.
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
