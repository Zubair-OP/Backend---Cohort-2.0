import {io} from 'socket.io-client'

export const InitializeSocket = () => {
    const socket = io('http://localhost:3000', {
        withCredentials: true,
    })

    socket.on('connect', () => {
        console.log('Connected to socket server')
    })

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message)
    })

    return socket
}