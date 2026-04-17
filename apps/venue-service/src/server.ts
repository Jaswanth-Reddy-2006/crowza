import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import venueRoutes from './routes/venue.routes';
import logger from './utils/logger';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.VENUE_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/', venueRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'venue-service', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Venue Service running on port ${PORT}`);
});

export default app;
