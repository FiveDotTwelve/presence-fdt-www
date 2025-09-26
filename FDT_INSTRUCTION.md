<p align="left">
  <img src="src/public/img/fivedottwelve.jpg" alt="FiveDotTwelve — App Development Company" width="92px" height="92px">
</p>

<p>
⭐ Below is an overview of how the bot works. 🚀✨
</p>

---

## Google Sheet

This Google Sheet tracks external employees’ daily availability. It stores their personal info, Slack IDs, assigned project managers, current status, response timestamps, reasons for absence, and working hours, allowing the bot to send messages and notify PMs automatically.

Some columns, such as Name, SlackID, Email, PM, pmID, checkHour, and workingHours, are filled in manually. The bot automatically updates columns like Status, lastConfirmed, and Reason

## Daily Message

The bot sends a message to each external employee at a specified time, asking if they are available today.

<p>
  <img src="src/public/img/tutorial/daily_message.png" alt="FiveDotTwelve — App Development Company">
</p>

## Absent

When the “No” button is clicked, a modal opens prompting the employee to provide a reason for their unavailability.

<p>
  <img src="src/public/img/tutorial/reason_modal.png" alt="FiveDotTwelve — App Development Company">
</p>

After the response is submitted, the data is automatically recorded in Google Sheets, and a notification message is sent to the project manager.

<p>
  <img src="src/public/img/tutorial/absent.png" alt="FiveDotTwelve — App Development Company">
</p>

## Present

After clicking the “Yes” button, the employee’s availability is recorded in Google Sheets.

<p>
  <img src="src/public/img/tutorial/present.png" alt="FiveDotTwelve — App Development Company">
</p>

## No Response

If the employee does not respond within an hour, their status is marked as “No Response” in Google Sheets, and a notification is sent to the project manager. 

<p>
  <img src="src/public/img/tutorial/no_response.png" alt="FiveDotTwelve — App Development Company">
</p>
