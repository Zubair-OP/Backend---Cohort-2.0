import 'dotenv/config';
import app from './src/app.js';
import connectDB from './config/database.js';
import http from 'http';
import { initSocket } from './src/sockets/server.socket.js';


const httpserver = http.createServer(app);
initSocket(httpserver)

connectDB();

const PORT = process.env.PORT || 3000;
httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});