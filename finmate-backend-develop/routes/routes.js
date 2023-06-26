const transactionRoute = require("./transaction");
const dashboardRoute = require("./dashboard");
const authRoute = require("./auth");
const userRoute = require("./user");
const budgetRoute = require("./budget");
const billRoute = require("./bill");
const configRoutes = app => {
  app.use("/dashboard", dashboardRoute);
  app.use("/auth", authRoute);
  app.use("/user", userRoute);
  app.use("/transaction", transactionRoute);
  app.use("/budget", budgetRoute);
  app.use("/bill", billRoute);
};

module.exports = { configRoutes };
