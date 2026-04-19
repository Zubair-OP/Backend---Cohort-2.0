import express from 'express';
const app = express();
import graph from './services/graph.service.js';


app.get('/', async(req,res) => {
    const result = await graph("What is the capital of France?");
    res.json(result);
});

export default app;