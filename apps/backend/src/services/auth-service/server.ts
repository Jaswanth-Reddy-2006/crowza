import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'auth-service', status: 'up' });
});

const PORT = process.env.AUTH_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
