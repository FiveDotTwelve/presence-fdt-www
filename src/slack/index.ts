import { app } from '../configs/slack';
import { ConfirmPresence } from './actions/confirmPresence';
import { DenyPresence } from './actions/denypresence';
import { CheckPresence } from './lib/checkPresence';
import { DenyReasonModal } from './view/denyReasonModal';

export const Manager = async () => {
  await CheckPresence();
  ConfirmPresence(app);
  DenyPresence(app);
  DenyReasonModal(app);
};
