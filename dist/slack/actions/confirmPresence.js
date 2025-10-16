"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPresence = void 0;
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const checkPresence_1 = require("../lib/checkPresence");
const ConfirmPresence = (app) => {
    return app.action('confirm_presence', async ({ ack, body, client }) => {
        await ack();
        const actionBody = body;
        checkPresence_1.confirmed.set(actionBody.channel.id, true);
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
            const { data } = await google_1.sheets.spreadsheets.values.get({
                spreadsheetId: env_1.ENV.GOOGLE_SHEET_ID,
                range: env_1.ENV.GOOGLE_SHEET_RANGE,
            });
            const rows = data.values || [];
            const rowIndex = rows.findIndex((row) => row[1] === actionBody.user.id);
            if (rowIndex !== -1) {
                const sheetRow = rowIndex + 2;
                await google_1.sheets.spreadsheets.values.update({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: `Sheet1!F${sheetRow}:H${sheetRow}`,
                    valueInputOption: 'RAW',
                    requestBody: {
                        values: [['Present', new Date().toLocaleString(), '-']],
                    },
                });
            }
        }
        catch (error) {
            console.error('Error updating message:', error);
        }
    });
};
exports.ConfirmPresence = ConfirmPresence;
