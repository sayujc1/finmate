const express = require("express");
const budgetRoute = express.Router();

const {
  viewBudgetDetails,
  deleteBudgetDetails,
  addBudgetDetails,
  updateBudgetDetails,
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authProtect");
//view
budgetRoute.post("/viewBudgetDetails", protect, viewBudgetDetails);
//delete
budgetRoute.delete("/deleteBudgetDetails/:id", protect, deleteBudgetDetails);
//add
budgetRoute.post("/addBudgetDetails", protect, addBudgetDetails);
//update
budgetRoute.put("/updateBudgetDetails", protect, updateBudgetDetails);
module.exports = budgetRoute;
