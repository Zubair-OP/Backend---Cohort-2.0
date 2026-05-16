import { Socket } from "socket.io";
import { runGraphStreaming } from "../services/graph.service.js";

export function handleSocketConnection(socket: Socket) {

    socket.on("ask_ai", async (problem: string) => {

        try {

            await runGraphStreaming(problem, socket);

        } catch (error) {

            console.error(error);

            socket.emit("error_message", {
                message: "Something went wrong"
            });
        }

    });

}