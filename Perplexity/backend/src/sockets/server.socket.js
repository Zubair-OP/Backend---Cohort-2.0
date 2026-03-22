import {Server} from 'socket.io'


let io;
export async function initSocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            credentials: true
        }
    })

    console.log('Socket.io Server is running')


    io.on('connection', (socket) => {
        console.log('a user connected: ' + socket.id)
    })
}


export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }
    return io
}