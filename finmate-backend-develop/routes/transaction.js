const express = require("express");
const transactionRoute = express.Router();

const {
  viewTransactionDetails,
  viewRecentTransactionDetails,
  viewTransactionDetailsByType,
  deleteTransactionDetails,
  addTransactionDetails,
  updateTransactionDetails,
} = require("../controllers/transactionController");
const { protect } = require("../middlewares/authProtect");
//view
transactionRoute.post("/viewTransactionDetails", protect, viewTransactionDetails);
transactionRoute.get("/viewTransactionDetails/:type/:date", protect, viewTransactionDetailsByType);
transactionRoute.get("/viewRecentTransactionDetails/:limit", protect, viewRecentTransactionDetails);
//delete
transactionRoute.delete("/deleteTransactionDetails/:id", protect, deleteTransactionDetails);
//add
transactionRoute.post("/addTransactionDetails", protect, addTransactionDetails);
//update
transactionRoute.put("/updateTransactionDetails", protect, updateTransactionDetails);
module.exports = transactionRoute;
