import { app, receiver } from './configs/slack';
import express from 'express';
import path from 'path';
import { ENV } from './utils/env';
import { SlackApp } from './slack';

receiver.app.use(express.static(path.join(__dirname, 'public')));

receiver.app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

(async () => {
  await app.start(ENV.PORT);
  await SlackApp();
  console.log('⚡ FDTPresence running locally!');
  console.log(`Server running at http://localhost:${ENV.PORT}`);
})();

export default receiver.app;
