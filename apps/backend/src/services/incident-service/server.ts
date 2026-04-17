import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'incident-service', status: 'up' });
});

const PORT = process.env.INCIDENT_SERVICE_PORT || 3004;
app.listen(PORT, () => {
  console.log(`Incident service running on port ${PORT}`);
});
