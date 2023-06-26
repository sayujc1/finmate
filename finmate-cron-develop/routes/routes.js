const cronRoute = require("./cron");
const configRoutes = app => {
  app.use("/cron", cronRoute);
};

module.exports = { configRoutes };
