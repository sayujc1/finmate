const express = require("express");
const dashboardRoute = express.Router();

const {
  viewDashboardDetails
} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authProtect");

dashboardRoute.post("/viewDashboardDetails", protect, viewDashboardDetails);

module.exports = dashboardRoute;
