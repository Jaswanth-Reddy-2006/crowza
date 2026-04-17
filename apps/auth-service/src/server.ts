import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import logger from './utils/logger';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many login attempts, please try again later',
});
app.use('/auth/login', limiter);

// Routes
app.use('/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'auth-service', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});

export default app;
