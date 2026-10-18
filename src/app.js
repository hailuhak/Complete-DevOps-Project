import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger.js';

const app = express();

app.use(helmet());

app.use(express.json());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get('/', (req, res) => {
  logger.info('GET / - API health check');

  res.json({
    message: 'DevOps Engineering API is running',
  });
});

export default app;
