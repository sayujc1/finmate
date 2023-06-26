const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const {
  BUDGET_DOES_NOT_EXISTS,
  DELETE_SUCCESS,
  INSERT_SUCCESS,
  UPDATE_SUCCESS,
} = require("../messages/responseMessages");
const {
  fetchBudgetDetails,
  updateBudgetDetails,
  deleteBudgetDetailsById,
  addBudgetDetails,
} = require("../repository/budgetRepository");
const { fetchSpent } = require("../repository/transactionRepository");
const moment = require("moment");

exports.viewBudgetDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let dateType = req.body.dateType; // month , year ,custom
  let start_date = req.body.start_date; //DD/MM/YYYY
  let end_date = req.body.end_date; //DD/MM/YYYY
  try {
    let result = await fetchBudgetDetails(
      connectionPromise,
      dateType,
      start_date,
      end_date,
      req.user
    );
    let totalBudget = result.reduce((a, b) => a + b.budget, 0);
    let totalSpent = result.reduce((a, b) => a + b.spent, 0);
    if (result.length > 0) {
      result.map(item => {
        item.start_date = moment(item.start_date).format("DD/MM/YYYY");
        item.end_date = moment(item.end_date).format("DD/MM/YYYY");
      });

      res.status(200).json({
        status: "SUCCESS",
        data: {
          data: result,
          totalBudget: totalBudget,
          totalSpent: totalSpent,
          status: totalSpent >= totalBudget ? "Over Limit" : "Under Limit",
        },
      });
    } else {
      res.status(200).json({
        status: "NO_DATA_FOUND",
        data: {
          data: result,
          totalBudget: totalBudget,
          totalSpent: totalSpent,
          status: "N/A",
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

exports.deleteBudgetDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let bid = req.params.id;
  try {
    let result = await deleteBudgetDetailsById(
      connectionPromise,
      bid,
      req.user
    );
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: `Budget ${DELETE_SUCCESS}`,
      });
    } else {
      res.status(404).json({
        status: "NO_DATA_FOUND",
        message: BUDGET_DOES_NOT_EXISTS,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
exports.addBudgetDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let budget = req.body;
  // format date to YYYY/MM/DD
  budget.start_date = budget.start_date.split("/").reverse().join("/");
  budget.end_date = budget.end_date.split("/").reverse().join("/");
  try {
    let resp = await fetchSpent(connectionPromise, budget, req.user);
    budget.spent = resp[0].spent;
    budget.status = budget.spent > budget.budget ? "Over Limit" : "Under Limit";
    await addBudgetDetails(connectionPromise, budget, req.user)
      .then(result => {
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: "SUCCESS",
            data: budget,
            message: `Budget ${INSERT_SUCCESS}`,
          });
        } else {
          res.status(500).json({
            status: "ERROR",
            message: "Failed to save budget details, Please try again!",
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          status: "ERROR",
          message: err
            ? err.code === "ER_DUP_ENTRY"
              ? "Budget already exists for this date range!"
              : err.message
            : "Failed to save budget details, Please try again!",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};

exports.updateBudgetDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let budget = req.body;
  // format date to YYYY/MM/DD
  budget.start_date = budget.start_date.split("/").reverse().join("/");
  budget.end_date = budget.end_date.split("/").reverse().join("/");
  try {
    let resp = await fetchSpent(connectionPromise, budget, req.user);
    budget.spent = resp[0].spent ? resp[0].spent : 0;
    budget.status = budget.spent > budget.budget ? "Over Limit" : "Under Limit";
    await updateBudgetDetails(connectionPromise, budget, req.user)
      .then(result => {
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: "SUCCESS",
            message: `Budget ${UPDATE_SUCCESS}`,
            data: budget,
          });
        } else {
          res.status(500).json({
            status: "ERROR",
            message:
              "Failed to update budget details, Please send valid budget!",
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          status: "ERROR",
          message: err
            ? err.code === "ER_DUP_ENTRY"
              ? "Budget already created for this date range! Please change the date range."
              : err.message
            : "Failed to save budget details, Please try again!",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
