const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "finmate-no-reply@sehgaltech.com", // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
});
