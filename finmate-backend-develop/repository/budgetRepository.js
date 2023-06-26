exports.fetchBudgetDetailsByType = async (
  connectionPromise,
  type,
  month,
  year,
  user
) => {
  let result = await connectionPromise(
    `SELECT * FROM budget WHERE type = '${type}' AND MONTH(date) = '${month}' AND YEAR(date) = '${year}' and user_id = '${user.user_id}'`
  );
  return result;
};

exports.deleteBudgetDetailsById = async (connectionPromise, bid, user) => {
  let result = await connectionPromise(
    `DELETE FROM budget WHERE b_id = '${bid}' AND user_id = '${user.user_id}'`
  );
  return result;
};

exports.addBudgetDetails = async (connectionPromise, budget, user) => {
  let result = await connectionPromise(
    `INSERT INTO budget (user_id, start_date, end_date, budget, spent, status, remarks, is_recurring) VALUES ('${user.user_id}','${budget.start_date}', '${budget.end_date}', '${budget.budget}', '${budget.spent}', '${budget.status}', '${budget.remarks}', '${budget.is_recurring}')`
  );
  return result;
};

exports.updateBudgetDetails = async (connectionPromise, budget, user) => {
  let result = await connectionPromise(
    `UPDATE budget SET  start_date = '${budget.start_date}', end_date = '${budget.end_date}',budget = '${budget.budget}', spent = '${budget.spent}', remarks = '${budget.remarks}', status = '${budget.status}', is_recurring = '${budget.is_recurring}' WHERE b_id = '${budget.b_id}' AND user_id = '${user.user_id}'`
  );
  return result;
};

exports.fetchBudgetDetails = async (
  connectionPromise,
  dateType,
  start_date,
  end_date,
  user
) => {
  let query = `SELECT * FROM budget WHERE user_id = '${user.user_id}'`;
  if (dateType === "month") {
    query += ` AND MONTH(start_date) = '${
      start_date.split("-")[1]
    }' AND YEAR(start_date) = '${
      start_date.split("-")[0]
    }' OR MONTH(end_date) = '${
      start_date.split("-")[1]
    }' AND YEAR(end_date) = '${start_date.split("-")[0]}'`;
  } else if (dateType === "year") {
    query += ` AND YEAR(start_date) = '${start_date}' OR YEAR(end_date) = '${start_date}'`;
  } else {
    query += ` AND 
      start_date BETWEEN '${start_date
        .split("/")
        .reverse()
        .join("/")}' AND '${end_date.split("/").reverse().join("/")}' AND 
      end_date BETWEEN '${start_date
        .split("/")
        .reverse()
        .join("/")}' AND '${end_date.split("/").reverse().join("/")}'`;
  }
  query += ` ORDER BY start_date DESC`;
  let result = await connectionPromise(query);
  return result;
  // let result = await connectionPromise(
  //   `SELECT * FROM budget WHERE MONTH(start_date) >= '${start_month}' AND YEAR(start_date) >= '${start_year}' AND MONTH(end_date) <= '${end_month}' AND YEAR(end_date) <= '${end_year}' and user_id = '${user.user_id}'`
  // );

  // return result;
};

exports.fetchRecentBudgetDetails = async (connectionPromise, limit, user) => {
  let result = await connectionPromise(
    `SELECT * FROM budget WHERE user_id = '${user.user_id}' ORDER BY last_updated_time DESC LIMIT ${limit}`
  );
  return result;
};
