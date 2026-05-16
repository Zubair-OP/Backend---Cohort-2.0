import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./src/socket/socketHandler.js";

const server = http.createServer(app);

// Socket.IO attach here
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    handleSocketConnection(socket);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});