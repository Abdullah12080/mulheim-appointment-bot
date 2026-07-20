const { checkAppointments } = require("./checker");

(async () => {
    try {
        const result = await checkAppointments();

        console.log(result);
    } catch (error) {
        console.error(error);
    }
})();