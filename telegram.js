require("dotenv").config();

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(message) {
    try {

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
            disable_notification: false
        });

        console.log("✅ Telegram message sent.");

    } catch (error) {

        console.log("❌ Failed to send Telegram message.");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

    }
}

module.exports = sendTelegramMessage;