const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function checkAppointments() {
    const browser = await chromium.launch({
        headless: true,
        slowMo: 300
    });

    const page = await browser.newPage();

    // Create debug folders if they don't exist
    const debugFolders = [
        "debug",
        "debug/appointments",
        "debug/errors",
        "debug/unknown"
    ];

    debugFolders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    });

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

        await page.waitForLoadState("networkidle");

        console.log("Current URL:", page.url());
        console.log("Page Title:", await page.title());

        const pageText = await page.textContent("body");

        const noAppointment =
            pageText.includes("Kein freier Termin verfügbar") ||
            pageText.includes("Keine Zeiten verfügbar");

        const appointmentButtons = await page
            .locator("form.suggestion_form button.suggest_btn[type='submit']")
            .count();

        console.log("No appointment message:", noAppointment);
        console.log("Appointment buttons found:", appointmentButtons);

        let available = false;

        if (appointmentButtons > 0) {

            console.log("✅ Appointment found.");
            available = true;

            const timestamp = new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\..+/, "");

            await page.screenshot({
                path: path.join(
                    "debug",
                    "appointments",
                    `appointment-${timestamp}.png`
                ),
                fullPage: true
            });

            fs.writeFileSync(
                path.join(
                    "debug",
                    "appointments",
                    `appointment-${timestamp}.html`
                ),
                await page.content()
            );

            fs.writeFileSync(
                path.join(
                    "debug",
                    "appointments",
                    `appointment-${timestamp}.txt`
                ),
                pageText
            );

        } else if (noAppointment) {

            console.log("❌ No appointments available.");
            available = false;

        } else {

            console.log("⚠️ Unknown page detected.");

            const timestamp = new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\..+/, "");

            await page.screenshot({
                path: path.join(
                    "debug",
                    "unknown",
                    `unknown-${timestamp}.png`
                ),
                fullPage: true
            });

            fs.writeFileSync(
                path.join(
                    "debug",
                    "unknown",
                    `unknown-${timestamp}.html`
                ),
                await page.content()
            );

            fs.writeFileSync(
                path.join(
                    "debug",
                    "unknown",
                    `unknown-${timestamp}.txt`
                ),
                pageText
            );

            available = false;
        }

        await browser.close();

        return {
            success: true,
            available
        };

    } catch (error) {

        console.error("Error:", error.message);

        try {

            const timestamp = new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\..+/, "");

            await page.screenshot({
                path: path.join(
                    "debug",
                    "errors",
                    `error-${timestamp}.png`
                ),
                fullPage: true
            });

            fs.writeFileSync(
                path.join(
                    "debug",
                    "errors",
                    `error-${timestamp}.html`
                ),
                await page.content()
            );

            fs.writeFileSync(
                path.join(
                    "debug",
                    "errors",
                    `error-${timestamp}.txt`
                ),
                await page.textContent("body")
            );

        } catch {

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