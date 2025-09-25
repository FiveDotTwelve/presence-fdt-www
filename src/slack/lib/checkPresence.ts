import nodeCron from 'node-cron';
import { app } from '../../configs/slack';
import { GetUserSheet } from '../../services/getUserSheet';
import { sheets } from '../../configs/google';
import { ENV } from '../../utils/env';
import { IsWithinWorkingHours } from './isWithinWorkingHours';

export const CheckPresence = async () => {
  const users = await GetUserSheet();

  for (const user of users) {
    if (!user.checkHour || !user.slackId || !user.workingHours) continue;
    if (!IsWithinWorkingHours(user.checkHour, user.workingHours)) continue;

    const [hour, minute] = user.checkHour.split(':').map(Number);
    const cronExpr = `${minute} ${hour} * * 1-5`;

    nodeCron.schedule(
      cronExpr,
      async () => {
        try {
          const res = await app.client.chat.postMessage({
            channel: user.slackId,
            text: `Hello <@${user.slackId}>, are you available today?`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:wave: Hello <@${user.slackId}>, are you available today?`,
                },
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: { type: 'plain_text', text: "✅️ Yes, I'm here", emoji: true },
                    value: 'yes_present',
                    action_id: 'confirm_presence',
                    style: 'primary',
                  },
                  {
                    type: 'button',
                    text: { type: 'plain_text', text: '❌ No, give a reason', emoji: true },
                    value: 'no_reason',
                    action_id: 'deny_presence',
                    style: 'danger',
                  },
                ],
              },
            ],
          });

          setTimeout(async () => {
            try {
              await app.client.chat.update({
                channel: res.channel!,
                ts: res.ts!,
                text: `⏰ Hello <@${user.slackId}>, the time for response has passed.`,
                blocks: [
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `⏰ Hello <@${user.slackId}>, the time for response has passed.`,
                    },
                  },
                ],
              });

              const { data } = await sheets.spreadsheets.values.get({
                spreadsheetId: ENV.GOOGLE_SHEET_ID,
                range: ENV.GOOGLE_SHEET_RANGE,
              });
              const rows = data.values || [];
              const rowIndex = rows.findIndex((row) => row[1] === user.slackId);
              if (rowIndex !== -1) {
                const sheetRow = rowIndex + 2;
                await sheets.spreadsheets.values.update({
                  spreadsheetId: ENV.GOOGLE_SHEET_ID,
                  range: `List!F${sheetRow}:H${sheetRow}`,
                  valueInputOption: 'RAW',
                  requestBody: { values: [['No response', new Date().toLocaleString(), '-']] },
                });
              }

              if (user.pmId) {
                await app.client.chat.postMessage({
                  channel: user.pmId,
                  text: `⚠️ <@${user.slackId}> did not respond within 1 hour.`,
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `⚠️ <@${user.slackId}> did not respond within 1 hour.`,
                      },
                    },
                  ],
                });
              }
            } catch (err) {
              console.error(`Error updating message for ${user.slackId}:`, err);
            }
          }, 3600000);
        } catch (error) {
          console.error(`Error sending message to ${user.slackId}:`, error);
        }
      },
      { timezone: 'Europe/Warsaw' },
    );
  }
};
