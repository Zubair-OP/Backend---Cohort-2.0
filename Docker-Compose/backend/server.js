import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from the backend!' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});