const { chromium } = require("playwright");

async function checkAppointments() {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });

    const page = await browser.newPage();

    await page.goto("https://terminvergabe.muelheim-ruhr.de/");

    await browser.close();

    return "Browser opened successfully!";
}

module.exports = {
    checkAppointments
};