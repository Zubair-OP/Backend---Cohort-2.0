import express from 'express';
const app = express();
import graph from './services/graph.service.js';


app.get('/', async(req,res) => {
    const result = await graph("What is the capital of France?");
    res.json(result);
});

app.post('/submit-problem', async(req,res) => {
    const { problem } = req.body;
    const result = await graph(problem);
    res.json({
        result,
        success:true
    });
});

export default app;