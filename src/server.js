import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRouter.js';

dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.send({ message: 'API is working' });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}
