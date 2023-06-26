exports.updateBillPaymentStatus = async connectionPromise => {
  // fetch all paid bills with due date within 5 days of today and update status to 'Not Paid' in one query
  let query = `UPDATE bill SET status = 'Not Paid' WHERE status ='Paid' AND due_date <= DATE_ADD(CURDATE(), INTERVAL 5 DAY)`;
  let result = await connectionPromise(query);
  return result;
};

exports.fetchBillsForRemindersByUserId = async (connectionPromise, userId) => {
  // fetch all paid bills with due date within 5 days of today and update status to 'Not Paid' in one query
  let query = `SELECT * FROM bill WHERE status ='Not Paid' AND due_date <= DATE_ADD(CURDATE(), INTERVAL 5 DAY) AND user_id = '${userId}'`;
  let result = await connectionPromise(query);
  return result;
};
