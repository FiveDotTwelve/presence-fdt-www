"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPresence = exports.confirmed = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const slack_1 = require("../../configs/slack");
const getUserSheet_1 = require("../../services/getUserSheet");
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const isWithinWorkingHours_1 = require("./isWithinWorkingHours");
exports.confirmed = new Map();
const CheckPresence = async () => {
    const users = await (0, getUserSheet_1.GetUserSheet)();
    for (const user of users) {
        const status = slack_1.app.client.users.profile.get({
            user: user.slackId,
        });
        if ((await status).profile?.status_text === 'Vacationing')
            continue;
        if (!user.checkHour || !user.slackId || !user.workingHours)
            continue;
        if (!(0, isWithinWorkingHours_1.IsWithinWorkingHours)(user.checkHour, user.workingHours))
            continue;
        const [hour, minute] = user.checkHour.split(':').map(Number);
        const cronExpr = `${minute} ${hour} * * 1-5`;
        node_cron_1.default.schedule(cronExpr, async () => {
            try {
                const res = await slack_1.app.client.chat.postMessage({
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
                console.log('confirmed: ', exports.confirmed);
                if (!exports.confirmed.get(user.slackId)) {
                    setTimeout(async () => {
                        try {
                            await slack_1.app.client.chat.update({
                                channel: res.channel,
                                ts: res.ts,
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
                            const { data } = await google_1.sheets.spreadsheets.values.get({
                                spreadsheetId: env_1.ENV.GOOGLE_SHEET_ID,
                                range: env_1.ENV.GOOGLE_SHEET_RANGE,
                            });
                            const rows = data.values || [];
                            console.log('rows:', rows);
                            const rowIndex = rows.findIndex((row) => row[1] === user.slackId);
                            const statusRow = rows[rowIndex][5]; // e.g. 'Present' or 'Absent'
                            const timestamp = rows[rowIndex][6]; // e.g. '10/17/2025, 11:01:45 AM'
                            // Parse date from timestamp
                            const rowDate = new Date(timestamp).toDateString();
                            const todayDate = new Date().toDateString();
                            console.log('rowIndex: ', rowIndex, rows[rowIndex]);
                            console.log('statusRow: ', statusRow);
                            console.log('rowDate !== todayDate: ', rowDate !== todayDate);
                            if (rowIndex !== -1 && statusRow !== 'Present' && rowDate !== todayDate) {
                                const sheetRow = rowIndex + 2;
                                await google_1.sheets.spreadsheets.values.update({
                                    spreadsheetId: env_1.ENV.GOOGLE_SHEET_ID,
                                    range: `Sheet1!F${sheetRow}:H${sheetRow}`,
                                    valueInputOption: 'RAW',
                                    requestBody: { values: [['No response', new Date().toLocaleString(), '-']] },
                                });
                                if (user.pmId) {
                                    await slack_1.app.client.chat.postMessage({
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
                            }
                        }
                        catch (err) {
                            console.error(`Error updating message for ${user.slackId}:`, err);
                        }
                    }, 300000);
                }
            }
            catch (error) {
                console.error(`Error sending message to ${user.slackId}:`, error);
            }
        }, { timezone: 'Europe/Warsaw' });
    }
};
exports.CheckPresence = CheckPresence;
