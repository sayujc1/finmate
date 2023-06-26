// var cron = require("node-cron");
// const {
//   RECURRING_PAYMENT_CRON_SCHEDULE,
//   RECURRING_PAYMENT_CRON_START,
//   RECURRING_PAYMENT_CRON_TIMEZONE,
// } = require("../config/constants");
const {
  updatePaymentStatus,
  sendPaymentReminderMail,
} = require("../controllers/UpdatePaymentStatus");
const { sendWelcomeEmail } = require("../controllers/SendMail");
exports.cronService = async (req, res) => {
  // cron.schedule(
  //   RECURRING_PAYMENT_CRON_SCHEDULE,
  //   async () => {
  try {
    console.log(
      "running a task every day to calculate new payment status & send reminder emails" +
        new Date()
    );
    await updatePaymentStatus();
    await sendPaymentReminderMail();
    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
  // }),
  //   {
  //     scheduled: RECURRING_PAYMENT_CRON_START,
  //     timezone: RECURRING_PAYMENT_CRON_TIMEZONE,
  //   };
  //   );
};

exports.welcomeEmailService = async (req, res) => {
  try {
    console.log("sending welcome email" + new Date());
    await sendWelcomeEmail(req);
    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
