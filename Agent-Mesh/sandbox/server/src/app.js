import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { v7 as uuid } from 'uuid';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/sandbox/health', (req, res) => {
  res.status(200).json({
    message: 'Sandbox server is running',
    status: 'ok'
  });
});

app.post('/api/sandbox/start', async (req, res) => {
  const sandboxId = uuid();

  await Promise.all([
    getPod(sandboxId),
    createService(sandboxId)
  ]);

  res.status(200).json({
    message: 'Sandbox started successfully',
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`
  });
});

export default app;