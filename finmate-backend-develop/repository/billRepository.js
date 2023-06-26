exports.cancelBillDetailsById = async (connectionPromise, bid, user) => {
  let result = await connectionPromise(
    `UPDATE bill SET status = 'Canceled' WHERE bill_id = '${bid}' AND user_id = '${user.user_id}'`
  );
  return result;
};

exports.addBillDetails = async (connectionPromise, bill, user) => {
  let result = await connectionPromise(
    `INSERT INTO bill (user_id, description, category, amount, due_date, is_recurring, recurring_type, recurring_type_value, category_others, status, remarks, last_updated_time) VALUES ('${user.user_id}','${bill.description}', '${bill.category}', '${bill.amount}', '${bill.due_date}', '${bill.is_recurring}', '${bill.recurring_type}', '${bill.recurring_type_value}', '${bill.category_others}', '${bill.status}', '${bill.remarks}', '${bill.last_updated_time}')`
  );
  return result;
};

exports.updateBillDetails = async (connectionPromise, bill, user) => {
  let result = await connectionPromise(
    `UPDATE bill SET  description = '${bill.description}', category = '${bill.category}',amount = '${bill.amount}', category_others = '${bill.category_others}', remarks = '${bill.remarks}'  WHERE bill_id = '${bill.bill_id}' AND user_id = '${user.user_id}'`
  );
  return result;
};

exports.updateBillStatus = async (connectionPromise, bill, user) => {
  let result = await connectionPromise(
    `UPDATE bill SET status = '${bill.status}', due_date='${bill.due_date}', last_updated_time='${bill.last_updated_time}' WHERE bill_id = '${bill.bill_id}' AND user_id = '${user.user_id}'`
  );
  return result;
};

exports.fetchActiveBillDetails = async (connectionPromise, user) => {
  let query = `SELECT * FROM bill WHERE user_id = '${user.user_id}' AND status not in ('Canceled', 'Completed') ORDER BY due_date ASC`;
  let result = await connectionPromise(query);
  return result;
};

exports.fetchInActiveBillDetails = async (connectionPromise, user) => {
  let query = `SELECT * FROM bill WHERE user_id = '${user.user_id}' AND status in ('Canceled', 'Completed') ORDER BY due_date DESC`;
  let result = await connectionPromise(query);
  return result;
};
