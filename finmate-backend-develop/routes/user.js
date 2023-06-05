const express = require("express");
const userRoute = express.Router();

const {
  viewUserDetails,
  // updateUserDetails,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authProtect");

userRoute.get("/viewUserDetails", protect, viewUserDetails);
// userRoute.put("/updateUserDetails", protect, updateUserDetails);

module.exports = userRoute;
