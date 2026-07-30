# Mülheim Appointment Bot

An automated appointment monitoring bot for the Mülheim appointment portal.

The bot uses **Playwright** to periodically check for available appointments. When an appointment is detected, it captures debugging artifacts and immediately sends a Telegram notification.

---

## Features

- Automated appointment checking
- Headless browser automation using Playwright
- Telegram notifications
- Automatic screenshot capture
- HTML page dump for debugging
- Error logging
- Docker support

---

## Project Structure

```
mulheim-appointment-bot/
│
├── src/
│   ├── index.js
│   ├── checker.js
│   ├── config.js
│   ├── logger.js
│   └── telegram.js
│
├── data/
│   ├── debug/
│   │   ├── appointments/
│   │   ├── errors/
│   │   └── unknown/
│   │
│   └── logs/
│       └── bot.log
│
├── Dockerfile
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── .dockerignore
└── README.md
```

---

## Debug Output

When the bot detects an appointment, it stores:

- Screenshot
- HTML source
- Text summary

Location:

```
data/debug/appointments/
```

If an unexpected error occurs:

```
data/debug/errors/
```

If the page cannot be classified:

```
data/debug/unknown/
```

Application logs are stored in:

```
data/logs/
```

---

## Requirements

- Node.js 22+
- Docker Desktop
- Playwright

---

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Running Locally

```bash
node src/index.js
```

---

## Running with Docker

Build the image:

```bash
docker build -t appointment-bot .
```

Run the container:

```bash
docker run appointment-bot
```

> **Note:** Runtime files (screenshots, HTML dumps, logs) are currently stored inside the Docker container. In a later version, these will be persisted using Docker volumes.

---

## Environment Variables

Create a `.env` file containing the required configuration:

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## Tech Stack

- Node.js
- Playwright
- Docker
- Telegram Bot API

---

## Learning Goals

This project is being developed as part of a hands-on journey to learn:

- Node.js
- Browser Automation
- Docker
- Linux
- Containers
- Docker Volumes
- Docker Networking
- Docker Compose
- Deployment
