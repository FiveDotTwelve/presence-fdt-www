import { sheets } from '../configs/google';

export const GetUserSheet = async () => {
  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
    });

    const rows = data.values || [];

    const users = rows.map((row) => ({
      name: row[0],
      slackId: row[1],
      email: row[2],
      pm: row[3],
      pmId: row[4],
      status: row[5],
      lastConfirmed: row[6],
      reason: row[7],
      checkHour: row[8],
      workingHours: row[9],
    }));

    return users;
  } catch (error) {
    console.error('Error loading users from Google Sheets:', error);
    return [];
  }
};
