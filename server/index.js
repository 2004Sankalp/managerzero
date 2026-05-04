import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import standupRoutes from './routes/standup.js';
import meetingRoutes from './routes/meeting.js';
import feedbackRoutes from './routes/feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Rate Limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to 1000 to prevent auto-polling from triggering a lock out
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' }
});

app.use(limiter);

// Parse JSON payloads
app.use(express.json());

// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Global generic logging
app.use(logger);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Mount API routes
app.use('/api/standup', standupRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error boundary (must be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[BOOT] ManagerZero Multi-Agent Server initialized on port ${PORT}`);
  console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
});
