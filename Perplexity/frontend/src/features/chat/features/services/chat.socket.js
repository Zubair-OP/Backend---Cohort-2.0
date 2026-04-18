import {io} from 'socket.io-client'

let socketInstance = null

export const InitializeSocket = () => {
    if (socketInstance) {
        return socketInstance
    }

    socketInstance = io('http://localhost:3000', {
        withCredentials: true,
    })

    socketInstance.on('connect', () => {
        console.log('Connected to socket server')
    })

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message)
    })

    return socketInstance
}

export const GetSocket = () => socketInstance

export const DisconnectSocket = () => {
    if (!socketInstance) {
        return
    }

    socketInstance.removeAllListeners()
    socketInstance.disconnect()
    socketInstance = null
}
