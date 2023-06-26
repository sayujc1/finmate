const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const {
  updateBillPaymentStatus,
  fetchBillsForRemindersByUserId,
} = require("../repository/billRepository");
const { htmlGenerator } = require("./htmlGenerator");
const { fetchUserDetails } = require("../repository/userRepository");
const { sendMail } = require("./SendMail");
exports.updatePaymentStatus = async () => {
  return new Promise(async (resolve, reject) => {
    let connection = await getDbConnection();
    let connectionPromise = util.promisify(connection.query).bind(connection);
    try {
      await updateBillPaymentStatus(connectionPromise);
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      await closeDbConnection(connection);
    }
  });
};

exports.sendPaymentReminderMail = async () => {
  return new Promise(async (resolve, reject) => {
    let connection = await getDbConnection();
    let connectionPromise = util.promisify(connection.query).bind(connection);
    try {
      let limit = 10;
      let offset = 0;
      let users = await fetchUserDetails(connectionPromise, limit, offset);
      while (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          let bills = await fetchBillsForRemindersByUserId(
            connectionPromise,
            users[i].user_id
          );

          if (bills.length > 0) {
            let html = await htmlGenerator(bills);
            let text = `Hi, You have ${bills.length} bills due. Please pay them on time to avoid any late fees. Regards, FinMate Team`;
            let to = users[i].email;
            let subject = "Payment Reminder Alert";
            await sendMail(to, subject, text, html, users[i].user_id);
          }
        }
        offset += limit;
        users = await fetchUserDetails(connectionPromise, limit, offset);
      }
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      await closeDbConnection(connection);
    }
  });
};
