# Codex

This repository contains a simple Google Apps Script project.

## Files

- `Code.gs` - server-side script with `doGet` and weather function.
- `index.html` - client HTML page for the web app.

## Usage

Deploy the script as a Web App in Google Apps Script. When loaded, it displays a header with a logo, the title "Route Operations Dashboard", the current date and time, and weather information obtained from [Open-Meteo](https://open-meteo.com/).

## Development

Run `npm install` once to install the development dependencies. After that you can execute the Jest test suite with `npm test`.
