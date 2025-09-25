import { ENV } from './../utils/env';
import { google } from 'googleapis';
import path from 'path';

export const authSheet = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials', ENV.SHEET_SERVICE_ACCOUNT_PATH),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth: authSheet });
