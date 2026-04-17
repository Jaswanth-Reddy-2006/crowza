import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'analytics-service', status: 'up' });
});

const PORT = process.env.ANALYTICS_SERVICE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
