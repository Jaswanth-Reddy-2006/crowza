import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import crowdRoutes from './routes/crowd.routes';
import logger from './utils/logger';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.CROWD_SERVICE_PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/', crowdRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'crowd-service', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Crowd Service running on port ${PORT}`);
});

export default app;
