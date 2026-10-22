import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Motivo API Server is running on port ${PORT}`);
    console.log(`🔗 Health check available at: http://localhost:${PORT}/api/health`);
  });
};

startServer();
