const { transporter } = require("../config/mailconfig");
const { welcomeEmail } = require("./htmlGenerator");

exports.sendMail = (to, subject, text, html, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `FinMate <finmate-no-reply@sehgaltech.com>`, // sender address
        to: to ? to : "sayuj.sehgal@gmail.com", // list of receivers
        subject: subject
          ? subject
          : "OTP confirmation alert for your finmate account", // Subject line
        text: text ? text : "Hello world?", // plain text body
        html: html ? html : "<b>Hello world, this is a demo mail</b>", // html body
        dsn: {
          id: id ? id : "some random message specific id",
          return: "headers",
          notify: ["failure"],
          recipient: "finmate-no-reply@sehgaltech.com",
        },
      });

      resolve(info);
    } catch (error) {
      reject(error);
    }
  });
};

exports.sendWelcomeEmail = async req => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = req.body;
      let html = await welcomeEmail(user);
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `FinMate <finmate-no-reply@sehgaltech.com>`, // sender address
        to: user.email, // list of receivers
        subject: "Welcome to FinMate", // Subject line
        text: "Welcome to FinMate", // plain text body
        html: html ? html : "<b>Hello world, this is a demo mail</b>", // html body
        dsn: {
          id: user.name ? user.name : "some random message specific id",
          return: "headers",
          notify: ["failure"],
          recipient: "finmate-no-reply@sehgaltech.com",
        },
      });

      resolve(info);
    } catch (error) {
      reject(error);
    }
  });
};
