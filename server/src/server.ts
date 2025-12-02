import 'reflect-metadata';
import app from './app';
import { config } from './config';
import { AppDataSource } from './config/database';

const PORT = config.port;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        AppDataSource.destroy();
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        AppDataSource.destroy();
      });
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
    process.exit(1);
  });
