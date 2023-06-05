const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const express = require("express");
const { configRoutes } = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.origin ? process.env.origin : "http://localhost:3000"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

configRoutes(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
