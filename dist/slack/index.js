"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackApp = void 0;
const slack_1 = require("../configs/slack");
const confirmPresence_1 = require("./actions/confirmPresence");
const denypresence_1 = require("./actions/denypresence");
const checkPresence_1 = require("./lib/checkPresence");
const denyReasonModal_1 = require("./view/denyReasonModal");
const SlackApp = async () => {
    await (0, checkPresence_1.CheckPresence)();
    (0, confirmPresence_1.ConfirmPresence)(slack_1.app);
    (0, denypresence_1.DenyPresence)(slack_1.app);
    (0, denyReasonModal_1.DenyReasonModal)(slack_1.app);
};
exports.SlackApp = SlackApp;
