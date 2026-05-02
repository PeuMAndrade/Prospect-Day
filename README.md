<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/37bff1b0-f986-488c-b230-7b7b5efc9ce1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Google Sheets Data Source

The dashboard reads a JSON payload from an Apps Script web app (`/exec`).

Use the published endpoint in `VITE_GOOGLE_SHEETS_JSON_URL`.
The library URL (`/library/...`) is not used by the dashboard as a data source.

Use these files in this repo as the integration starter:

- [google-sheets-apps-script/Code.gs](google-sheets-apps-script/Code.gs)
- [google-sheets-apps-script/README.md](google-sheets-apps-script/README.md)

Set `VITE_GOOGLE_SHEETS_JSON_URL` in [.env.local](.env.local) to the published Apps Script web app URL.
