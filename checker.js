const { chromium } = require("playwright");
const fs = require("fs");

async function checkAppointments() {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });

    const page = await browser.newPage();

    try {
        await page.goto("https://terminvergabe.muelheim-ruhr.de/");

        // Step 1
        await page.getByRole("button", {
            name: "Ausländeramt"
        }).click();

        // Step 2
        await page.getByRole("tab", {
            name: "Studierende und Anerkennung"
        }).click();

        // Step 3
        await page.getByRole("button", {
            name: "Erhöhen der Anzahl des Anliegens Auflagenänderung (Wechsel Studium, Arbeit o.ä.)"
        }).click();

        await page.getByRole("button", {
            name: "Weiter"
        }).click();

        // Required documents
        await page.getByTitle("Aktuelle Aufenthaltserlaubnis").click();
        await page.getByTitle("Aktuelle Immatrikulationsbescheinigung").click();
        await page.getByTitle("Bearbeitungsgebühren über 50 €").click();
        await page.getByTitle("Zusätzlich bei Wechsel des").click();
        await page.getByTitle("Exmatrikulationsbescheinigung").click();
        await page.getByTitle("Bescheinigung über anerkannte").click();
        await page.getByTitle("Formloser schriftlicher").click();

        await page.getByRole("button", {
            name: "Weiter",
            description: "OK"
        }).click();

        await page.getByRole("button", {
            name: "Weiter"
        }).click();

        // Wait for the appointment page to finish loading
        await page.waitForLoadState("networkidle");

        // Read all text from the page
        const pageText = await page.textContent("body");

        // Check if the page says there are no appointments
        const noAppointment =
            pageText.includes("Kein freier Termin verfügbar") ||
            pageText.includes("Keine Zeiten verfügbar");

        console.log("No appointment detected:", noAppointment);

        await browser.close();

        return {
            success: true,
            available: !noAppointment
        };

    } catch (error) {

        console.error("Error:", error.message);

        try {
            await page.screenshot({
                path: "error.png",
                fullPage: true
            });

            const html = await page.content();
            fs.writeFileSync("error.html", html);
        } catch (e) {
            console.error("Could not save debug files.");
        }

        await browser.close();

        return {
            success: false,
            available: false,
            error: error.message
        };
    }
}

module.exports = checkAppointments;