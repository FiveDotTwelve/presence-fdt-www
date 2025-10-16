"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenyPresence = void 0;
const checkPresence_1 = require("../lib/checkPresence");
const DenyPresence = (app) => {
    return app.action('deny_presence', async ({ ack, body }) => {
        await ack();
        const actionBody = body;
        checkPresence_1.confirmed.set(actionBody.channel.id, true);
        try {
            app.client.views.open({
                trigger_id: actionBody.trigger_id,
                view: {
                    type: 'modal',
                    callback_id: 'deny_reason_modal',
                    private_metadata: JSON.stringify({
                        channel: actionBody.channel.id,
                        message_ts: actionBody.message.ts,
                        user_id: actionBody.user.id,
                    }),
                    title: { type: 'plain_text', text: 'FDTPresence' },
                    submit: { type: 'plain_text', text: 'Submit' },
                    close: { type: 'plain_text', text: 'Cancel' },
                    blocks: [
                        {
                            type: 'input',
                            block_id: 'reason_input',
                            element: {
                                type: 'plain_text_input',
                                action_id: 'reason',
                                placeholder: { type: 'plain_text', text: 'Enter your reason here...' },
                            },
                            label: { type: 'plain_text', text: 'Reason for absence' },
                        },
                    ],
                },
            });
        }
        catch (error) {
            console.error('Error updating message:', error);
        }
    });
};
exports.DenyPresence = DenyPresence;
