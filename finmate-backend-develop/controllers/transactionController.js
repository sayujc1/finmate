const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const {
  TRANSACTIONS_DOES_NOT_EXISTS,
  DELETE_SUCCESS,
  INSERT_SUCCESS,
  UPDATE_SUCCESS,
} = require("../messages/responseMessages");
const {
  fetchTransactionDetails,
  fetchTransactionDetailsByType,
  deleteTransactionDetailsById,
  addTransactionDetails,
  updateTransactionDetails,
  fetchRecentTransactionDetails,
  fetchTransactionDetailsByBillId,
} = require("../repository/transactionRepository");
const moment = require("moment");

exports.viewTransactionDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let dateType = req.body.dateType; // date, week, month ,quarter ,year ,custom
  let dateStart = req.body.dateStart;
  let dateEnd = req.body.dateEnd;
  try {
    let result = await fetchTransactionDetails(
      connectionPromise,
      dateType,
      dateStart,
      dateEnd,
      req.user
    );

    if (result.length > 0) {
      let income = result
        .filter(item => item.type === "Income")
        .reduce((a, b) => a + b.amount, 0);
      let expense = result
        .filter(item => item.type === "Expense")
        .reduce((a, b) => a + b.amount, 0);
      let savings = result
        .filter(item => item.type === "Saving")
        .reduce((a, b) => a + b.amount, 0);
      result.map(item => {
        item.date = moment(item.date).format("DD/MM/YYYY");
      });
      res.status(200).json({
        status: "SUCCESS",
        data: {
          data: result,
          totalIncome: income,
          totalExpense: expense,
          totalSavings: savings,
          totalBalance: income - expense - savings,
        },
      });
    } else {
      res.status(200).json({
        status: "NO_DATA_FOUND",
        data: {
          data: result,
          totalIncome: 0,
          totalExpense: 0,
          totalSavings: 0,
          totalBalance: 0,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};

exports.viewRecentTransactionDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  try {
    let result = await fetchRecentTransactionDetails(
      connectionPromise,
      req.params.limit,
      req.user
    );

    if (result.length > 0) {
      result.map(item => {
        item.date = moment(item.date).format("DD/MM/YYYY");
      });
      res.status(200).json({
        status: "SUCCESS",
        data: result,
      });
    } else {
      res.status(200).json({
        status: "NO_DATA_FOUND",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
exports.viewTransactionDetailsByType = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let type = req.params.type; //income or expense or savings
  let date = req.params.date; //YYYY-MM
  try {
    let month = date.split("-")[1];
    let year = date.split("-")[0];
    let result = await fetchTransactionDetailsByType(
      connectionPromise,
      type,
      month,
      year,
      req.user
    );
    if (result.length > 0) {
      result.map(item => {
        item.date = moment(item.date).format("DD/MM/YYYY");
      });
      res.status(200).json({
        status: "SUCCESS",
        data: {
          data: result,
          totalIncome: result.reduce((a, b) => a + b.amount, 0),
        },
      });
    } else {
      res.status(200).json({
        status: "NO_DATA_FOUND",
        data: {
          data: result,
          totalIncome: 0,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
exports.viewTransactionDetailsByBillId = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  try {
    let result = await fetchTransactionDetailsByBillId(
      connectionPromise,
      req.params.bill_id,
      req.user
    );
    if (result.length > 0) {
      result.map(item => {
        item.date = moment(item.date).format("DD/MM/YYYY");
        if (item.due_date)
          item.due_date = moment(item.due_date).format("DD/MM/YYYY");
      });
      res.status(200).json({
        status: "SUCCESS",
        data: result,
      });
    } else {
      res.status(200).json({
        status: "NO_DATA_FOUND",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};

exports.deleteTransactionDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let tid = req.params.id;
  try {
    let result = await deleteTransactionDetailsById(
      connectionPromise,
      tid,
      req.user
    );
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: `Transaction ${DELETE_SUCCESS}`,
      });
    } else {
      res.status(404).json({
        status: "NO_DATA_FOUND",
        message: TRANSACTIONS_DOES_NOT_EXISTS,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
exports.addTransactionDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let transaction = req.body;
  // format date to YYYY/MM/DD
  transaction.date = transaction.date.split("/").reverse().join("/");
  try {
    let result = await addTransactionDetails(
      connectionPromise,
      transaction,
      req.user
    );
    //update spent in budget table
    // if (transaction.type === "Expense") {
    //   let budget = await fetchBudgetDetailsByMonthYear(
    //     connectionPromise,
    //     transaction.date.split("/")[1],
    //     transaction.date.split("/")[2],
    //     req.user
    //   );
    //   if (budget.length > 0) {
    //     let spent = budget[0].spent + transaction.amount;
    //     await updateBudgetDetails(
    //       connectionPromise,
    //       budget[0].id,
    //       spent,
    //       req.user
    //     );
    //   }
    // }

    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "SUCCESS",
        data: result.insertId,
        message: `${transaction.type} ${INSERT_SUCCESS}`,
      });
    } else {
      res.status(500).json({
        status: "ERROR",
        message: err
          ? err.message
          : "Failed to save transaction details, Please try again!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
exports.updateTransactionDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let transaction = req.body;
  // format date to YYYY/MM/DD
  transaction.date = transaction.date.split("/").reverse().join("/");
  try {
    let result = await updateTransactionDetails(
      connectionPromise,
      transaction,
      req.user
    );
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: `${transaction.type} ${UPDATE_SUCCESS}`,
      });
    } else {
      res.status(500).json({
        status: "ERROR",
        message: err
          ? err.message
          : "Failed to update transaction details, Please try again!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
