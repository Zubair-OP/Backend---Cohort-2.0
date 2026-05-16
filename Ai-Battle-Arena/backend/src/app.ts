import express from 'express';
const app = express();
import cors from 'cors';

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

export default app;
