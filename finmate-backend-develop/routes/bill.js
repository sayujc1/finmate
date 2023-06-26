const express = require("express");
const billRoute = express.Router();

const {
  viewActiveBillDetails,
  viewInActiveBillDetails,
  cancelBillDetails,
  addBillDetails,
  updateBillDetails,
  updateBillStatus,
} = require("../controllers/billController");

const { protect } = require("../middlewares/authProtect");
//view
billRoute.get("/viewActiveBillDetails", protect, viewActiveBillDetails);
billRoute.get("/viewInActiveBillDetails", protect, viewInActiveBillDetails);
//cancel
billRoute.put("/cancelBillDetails/:id", protect, cancelBillDetails);
//add
billRoute.post("/addBillDetails", protect, addBillDetails);
//update
billRoute.put("/updateBillDetails", protect, updateBillDetails);
billRoute.put("/updateBillStatus", protect, updateBillStatus);
module.exports = billRoute;
