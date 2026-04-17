import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import incidentRoutes from './routes/incident.routes';
import logger from './utils/logger';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.INCIDENT_SERVICE_PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/incidents', incidentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'incident-service', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Incident Service running on port ${PORT}`);
});

export default app;
