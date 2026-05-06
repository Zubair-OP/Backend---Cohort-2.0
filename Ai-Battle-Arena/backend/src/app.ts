import express from 'express';
const app = express();
import graph from './services/graph.service.js';
import cors from 'cors';

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());



app.get('/', async(req,res) => {
    const result = await graph("What is the capital of France?");
    res.json(result);
});

app.post('/ask', async(req,res) => {
    const { problem } = req.body;
    const result = await graph(problem);
    res.json({
        result,
        success:true
    });
});

export default app;