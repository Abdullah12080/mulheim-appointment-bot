require("dotenv").config();
const log = require("./logger");
const checkAppointments = require("./checker");
const sendTelegramMessage = require("./telegram");

const CHECK_INTERVAL = Number(process.env.CHECK_INTERVAL);

let notificationSent = false;

async function runBot() {

    log("--------------------------------");
    log("Checking appointments...");

    const result = await checkAppointments();

    if (!result.success) {
        log("⚠️ Check failed.");
        log(result.error);
        return;
    }

    if (result.available) {

        log("🎉 Appointment available!");

        if (!notificationSent) {

            await sendTelegramMessage(
                "🚨 Appointment Available!\n\nOpen the Mülheim appointment website immediately."
            );

            notificationSent = true;

            log("📱 Telegram notification sent.");

        } else {

            log("🔕 Notification already sent.");

        }

    } else {

        log("❌ No appointments available.");

        notificationSent = false;

    }
}

// Run immediately
runBot();

// Run repeatedly
setInterval(runBot, CHECK_INTERVAL);