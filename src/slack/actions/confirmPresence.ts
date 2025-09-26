/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '@slack/bolt';
import { sheets } from '../../configs/google';
import { ENV } from '../../utils/env';

export const ConfirmPresence = (app: App) => {
  return app.action('confirm_presence', async ({ ack, body, client }) => {
    await ack();

    const actionBody = body as any;
    
    
    try {
      await client.chat.update({
        channel: actionBody.channel.id,
        ts: actionBody.message.ts,
        text: `✅️ Thanks <@${actionBody.user.id}> is marked as present today!`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `✅️ Thanks <@${actionBody.user.id}> is marked as present today!`,
            },
          },
        ],
      });

      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEET_ID,
        range: ENV.GOOGLE_SHEET_RANGE,
      });

      const rows = data.values || [];

      const rowIndex = rows.findIndex((row) => row[1] === actionBody.user.id);

      if (rowIndex !== -1) {
        const sheetRow = rowIndex + 2;
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `List!F${sheetRow}:H${sheetRow}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Present', new Date().toLocaleString(), '-']],
          },
        });
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  });
};
