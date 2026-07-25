# Mülheim Appointment Availability Bot

An automated appointment monitoring tool built with **Node.js** and **Playwright** that continuously checks the Mülheim an der Ruhr appointment booking portal for available appointments and sends instant notifications via **Telegram** when a slot becomes available.

---

## Features

- Automated browser navigation using Playwright
- Navigates through the complete booking workflow
- Selects the required appointment category automatically
- Detects appointment availability using DOM element inspection
- Sends instant Telegram notifications
- Prevents duplicate notifications
- Saves debug logs, screenshots, and HTML files when unexpected pages or errors occur
- Runs automatically at configurable intervals

---

## Technologies Used

- JavaScript (Node.js)
- Playwright
- Telegram Bot API
- Git & GitHub

---

## Project Structure

```
mulheim-appointment-bot/
│
├── checker.js          # Appointment checking logic
├── index.js            # Main application loop
├── telegram.js         # Telegram notification service
├── config.js           # Configuration values
├── logger.js           # Logging utilities
├── package.json
├── .gitignore
└── README.md
```

---

## How It Works

1. Opens the Mülheim appointment website.
2. Navigates through the appointment booking process.
3. Selects the required service.
4. Checks the appointment page for available booking slots.
5. Sends a Telegram notification immediately when an appointment is detected.
6. Continues checking at regular intervals.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Abdullah12080/mulheim-appointment-bot.git
```

Navigate into the project:

```bash
cd mulheim-appointment-bot
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Configuration

Create your own configuration in `config.js`.

Example:

```javascript
module.exports = {
  BOT_TOKEN: "YOUR_TELEGRAM_BOT_TOKEN",
  CHAT_ID: "YOUR_CHAT_ID",
};
```

---

## Running the Bot

```bash
node index.js
```

---

## Example Notification

```
🎉 Appointment Available!

A new appointment has been detected on the Mülheim booking portal.
```

---

## Skills Demonstrated

- Browser Automation
- JavaScript & Node.js
- Playwright
- DOM Manipulation
- Asynchronous Programming
- Error Handling
- Logging & Debugging
- API Integration (Telegram Bot API)
- Git Version Control

---

## Future Improvements

- Automatic appointment booking
- Appointment date and time extraction
- Email notifications
- Docker support
- Web dashboard
- Configurable appointment categories

---

## Disclaimer

This project is intended for educational purposes and personal automation. Users are responsible for complying with the terms and conditions of the appointment booking website.
