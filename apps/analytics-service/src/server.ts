import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import analyticsRoutes from './routes/analytics.routes';
import logger from './utils/logger';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.ANALYTICS_SERVICE_PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'analytics-service', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Analytics Service running on port ${PORT}`);
});

export default app;
