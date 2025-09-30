"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheets = exports.authSheet = void 0;
const env_1 = require("./../utils/env");
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
exports.authSheet = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path_1.default.join(__dirname, 'credentials', env_1.ENV.SHEET_SERVICE_ACCOUNT_PATH),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
exports.sheets = googleapis_1.google.sheets({ version: 'v4', auth: exports.authSheet });
