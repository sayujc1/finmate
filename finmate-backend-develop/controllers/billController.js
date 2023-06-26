const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const {
  BUDGET_DOES_NOT_EXISTS,
  INSERT_SUCCESS,
  UPDATE_SUCCESS,
} = require("../messages/responseMessages");
const {
  fetchActiveBillDetails,
  fetchInActiveBillDetails,
  updateBillDetails,
  cancelBillDetailsById,
  addBillDetails,
  updateBillStatus,
} = require("../repository/billRepository");
const {
  addTransactionDetails,
} = require("../repository/transactionRepository");
const moment = require("moment");

exports.viewActiveBillDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  try {
    let result = await fetchActiveBillDetails(connectionPromise, req.user);
    if (result.length > 0) {
      result.map(item => {
        item.due_date = moment(item.due_date).format("DD/MM/YYYY");
        if (item.last_updated_time)
          item.last_updated_time = moment(item.last_updated_time).format(
            "DD/MM/YYYY"
          );
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
exports.viewInActiveBillDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  try {
    let result = await fetchInActiveBillDetails(connectionPromise, req.user);
    if (result.length > 0) {
      result.map(item => {
        item.due_date = moment(item.due_date).format("DD/MM/YYYY");
        if (item.last_updated_time)
          item.last_updated_time = moment(item.last_updated_time).format(
            "DD/MM/YYYY"
          );
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

exports.cancelBillDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let bid = req.params.id;
  try {
    let result = await cancelBillDetailsById(connectionPromise, bid, req.user);
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: `Bill Canceled successfully`,
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
exports.addBillDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let bill = req.body;
  // format date to YYYY/MM/DD
  bill.due_date = moment(bill.due_date, "DD/MM/YYYY").format("YYYY/MM/DD");
  let due_date = bill.due_date;

  try {
    bill.last_updated_time = null;
    if (bill.status === "Paid") {
      if (bill.is_recurring) {
        bill.due_date = moment(bill.due_date, "YYYY/MM/DD")
          .add(bill.recurring_type_value, bill.recurring_type)
          .format("YYYY/MM/DD");
      } else {
        bill.status = "Completed";
      }
      bill.last_updated_time = moment().format("YYYY/MM/DD");
    }
    await addBillDetails(connectionPromise, bill, req.user)
      .then(async result => {
        if (result.affectedRows > 0) {
          bill.bill_id = result.insertId;
          if (bill.status === "Paid" || bill.status === "Completed") {
            // add transaction
            let transaction = {
              type: "Expense",
              description: bill.description,
              amount: bill.amount,
              date: due_date,
              category: "Others",
              category_others:
                bill.category === "Others"
                  ? bill.category_others
                  : bill.category,
              remarks: bill.remarks,
              bill_id: bill.bill_id,
              due_date: due_date,
            };
            await addTransactionDetails(
              connectionPromise,
              transaction,
              req.user
            );
          }
          res.status(200).json({
            status: "SUCCESS",
            data: bill,
            message: `Bill ${INSERT_SUCCESS}`,
          });
        } else {
          res.status(500).json({
            status: "ERROR",
            message: "Failed to save bill details, Please try again!",
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          status: "ERROR",
          message: err
            ? err.message
            : "Failed to save bill details, Please try again!",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};

exports.updateBillDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let bill = req.body;

  try {
    await updateBillDetails(connectionPromise, bill, req.user)
      .then(async result => {
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: "SUCCESS",
            data: bill,
            message: `Bill ${UPDATE_SUCCESS}`,
          });
        } else {
          res.status(500).json({
            status: "ERROR",
            message: "Failed to update bill details, Please try again!",
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          status: "ERROR",
          message: err
            ? err.message
            : "Failed to update bill details, Please try again!",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};

exports.updateBillStatus = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let bill = req.body;
  // format date to YYYY/MM/DD
  bill.due_date = moment(bill.due_date, "DD/MM/YYYY").format("YYYY/MM/DD");
  let due_date = bill.due_date;

  try {
    if (bill.status === "Paid") {
      if (bill.is_recurring) {
        bill.due_date = moment(bill.due_date, "YYYY/MM/DD")
          .add(bill.recurring_type_value, bill.recurring_type)
          .format("YYYY/MM/DD");
      } else {
        bill.status = "Completed";
      }
    }
    bill.last_updated_time = moment().format("YYYY/MM/DD");
    await updateBillStatus(connectionPromise, bill, req.user)
      .then(async result => {
        if (result.affectedRows > 0) {
          if (bill.status === "Paid" || bill.status === "Completed") {
            // add transaction
            let transaction = {
              type: "Expense",
              description: bill.description,
              amount: bill.amount,
              date: moment().format("YYYY/MM/DD"),
              category: "Others",
              category_others:
                bill.category === "Others"
                  ? bill.category_others
                  : bill.category,
              remarks: bill.remarks,
              bill_id: bill.bill_id,
              due_date: due_date,
            };
            await addTransactionDetails(
              connectionPromise,
              transaction,
              req.user
            );
          }
          bill.due_date = moment(bill.due_date, "YYYY/MM/DD").format(
            "DD/MM/YYYY"
          );
          res.status(200).json({
            status: "SUCCESS",
            data: bill,
            message: `Bill ${UPDATE_SUCCESS}`,
          });
        } else {
          res.status(500).json({
            status: "ERROR",
            message: "Failed to update bill details, Please try again!",
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          status: "ERROR",
          message: err
            ? err.message
            : "Failed to update bill details, Please try again!",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err ? err.message : "Something went wrong, Please try again!",
    });
  }
};
