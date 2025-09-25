/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '@slack/bolt';
import { sheets } from '../../configs/google';
import { ENV } from '../../utils/env';

export const DenyReasonModal = (app: App) => {
  app.view('deny_reason_modal', async ({ ack, client, view }) => {
    await ack();

    const metadata = JSON.parse(view.private_metadata);
    const channelId = metadata.channel;
    const messageTs = metadata.message_ts;
    const userId = metadata.user_id;

    const reason = view.state.values['reason_input']['reason'].value;

    try {
      await client.chat.update({
        channel: channelId,
        ts: messageTs,
        text: `❌ <@${userId}> is marked as absent today!`,
      });

      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEET_ID,
        range: ENV.GOOGLE_SHEET_RANGE,
      });

      const rows = data.values || [];
      const pmIndex = 4;
      const rowIndex = rows.findIndex((row) => row[1] === userId);

      if (rowIndex !== -1) {
        const sheetRow = rowIndex + 2;
        const pmId = rows[rowIndex][pmIndex];
        await sheets.spreadsheets.values.update({
          spreadsheetId: ENV.GOOGLE_SHEET_ID,
          range: `List!F${sheetRow}:H${sheetRow}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Absent', new Date().toLocaleString(), reason]],
          },
        });

        if (pmId) {
          await client.chat.postMessage({
            channel: pmId,
            text: `:warning: <@${userId}> is marked as absent today!\nReason: ${reason}`,
          });
        }
      }
    } catch (error) {
      console.error('Error updating message or sheet:', error);
    }
  });
};
