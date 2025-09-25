import { App, ExpressReceiver } from '@slack/bolt';
import { ENV } from '../utils/env';

const receiver = new ExpressReceiver({
  signingSecret: ENV.SLACK_SIGNING_SECRET,
  endpoints: {
    events: '/slack/events',
    actions: '/slack/actions',
  },
});

const app = new App({
  token: ENV.SLACK_BOT_TOKEN,
  receiver,
});

export { app, receiver };
