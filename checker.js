const { chromium } = require("playwright");
const fs = require("fs");

async function checkAppointments() {
    const browser = await chromium.launch({
        headless: true,
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

        // Wait until page is fully loaded
        await page.waitForLoadState("networkidle");

        console.log("Current URL:", page.url());
        console.log("Page Title:", await page.title());

        // Read page text
        const pageText = await page.textContent("body");

        // Official "no appointments" message
        const noAppointment =
            pageText.includes("Kein freier Termin verfügbar") ||
            pageText.includes("Keine Zeiten verfügbar");

        // Count actual appointment buttons
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
                path: `appointment-${timestamp}.png`,
                fullPage: true
            });

            fs.writeFileSync(
                `appointment-${timestamp}.html`,
                await page.content()
            );

            fs.writeFileSync(
                `appointment-${timestamp}.txt`,
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
                path: `unknown-${timestamp}.png`,
                fullPage: true
            });

            fs.writeFileSync(
                `unknown-${timestamp}.html`,
                await page.content()
            );

            fs.writeFileSync(
                `unknown-${timestamp}.txt`,
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
                path: `error-${timestamp}.png`,
                fullPage: true
            });

            fs.writeFileSync(
                `error-${timestamp}.html`,
                await page.content()
            );

            fs.writeFileSync(
                `error-${timestamp}.txt`,
                await page.textContent("body")
            );

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