const express = require("express");
const cronRoute = express.Router();

const { cronService, welcomeEmailService } = require("../cron/cron");

// const { protect } = require("../middlewares/authProtect");
//view
cronRoute.get("/cronService", cronService);
cronRoute.post("/welcomeEmailService", welcomeEmailService);
module.exports = cronRoute;
