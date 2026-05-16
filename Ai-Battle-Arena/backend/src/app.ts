import express from 'express';
const app = express();
import graph from './services/graph.service.js';
import cors from 'cors';

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


app.post('/ask', async(req,res) => {
    const { problem } = req.body ?? {};
    if (!problem) {
        res.status(400).json({ success: false, message: 'problem field is required' });
        return;
    }
    const result = await graph(problem);
    res.json({
        result,
        success:true
    });
});

export default app;
