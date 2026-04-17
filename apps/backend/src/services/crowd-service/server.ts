import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'crowd-service', status: 'up' });
});

const PORT = process.env.CROWD_SERVICE_PORT || 3003;
app.listen(PORT, () => {
  console.log(`Crowd service running on port ${PORT}`);
});
