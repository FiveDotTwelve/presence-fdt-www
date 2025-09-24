import { app, receiver } from './configs/slack';
import express from 'express';
import path from 'path';
import { ENV } from './utils/env';

receiver.app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  await app.start(ENV.PORT);
  console.log('⚡ FDTPresence running locally!');
  console.log(`Server running at http://localhost:${ENV.PORT}`);
})();

export default receiver.app;
