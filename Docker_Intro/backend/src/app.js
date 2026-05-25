import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Docker!jnkn This is the backend server.');
});

app.get('/api/data', (req, res) => {
  const data = {
    message: 'This is some data from the backend!',
    timestamp: new Date(),
  };
  res.json(data);
});

export default app;