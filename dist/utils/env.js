"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string(),
    NODE_ENV: zod_1.z.string(),
    SLACK_BOT_TOKEN: zod_1.z.string(),
    SLACK_SIGNING_SECRET: zod_1.z.string(),
    SHEET_SERVICE_ACCOUNT_PATH: zod_1.z.string(),
    GOOGLE_SHEET_ID: zod_1.z.string(),
    GOOGLE_SHEET_RANGE: zod_1.z.string(),
});
exports.ENV = envSchema.parse(process.env);
