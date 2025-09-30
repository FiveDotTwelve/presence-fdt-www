"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_1 = require("./configs/slack");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./utils/env");
const slack_2 = require("./slack");
slack_1.receiver.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
slack_1.receiver.app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'views', 'index.html'));
});
(async () => {
    await slack_1.app.start(env_1.ENV.PORT);
    await (0, slack_2.SlackApp)();
    console.log('⚡ FDTPresence running locally!');
    console.log(`Server running at http://localhost:${env_1.ENV.PORT}`);
})();
exports.default = slack_1.receiver.app;
