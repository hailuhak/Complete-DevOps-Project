
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import userRoutes from '#routes/user.routes.js';

import logger from '#utils/logger.js';

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS configuration
if (process.env.CLIENT_URL) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    }),
  );
}

// 3. Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Parse cookies
app.use(cookieParser());

// 5. Compress eligible responses
app.use(compression());

// 6. Log HTTP requests through Winston
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// 7. Limit requests to API routes
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

// 8. API health-check route
app.get('/', (req, res) => {
  logger.info('GET / - API health check');

  res.status(200).json({
    message: 'DevOps Engineering API is running',
  });
});

// 9. Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// 10. Central error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    message:
      status >= 500
        ? 'Internal server error'
        : err.message,
  });
});

export default app;
