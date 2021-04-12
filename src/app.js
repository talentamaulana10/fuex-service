const express = require("express");

const config = require("./config/keys").mongoURI;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const users = require("./controllers/User");
const wallet = require("./controllers/Wallet");
const userType = require("./controllers/UserType");
const transactionStatus = require("./controllers/TransactionStatus");
const vehicleType = require("./controllers/VehicleType");
const transactions = require("./controllers/Transaction");
const fuelType = require("./controllers/FuelType");

const path = require("path");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose
  .connect(config, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb Successfuly Connect !"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/users", users);
app.use("/wallet", wallet);
app.use("/reference/user-type", userType);
app.use("/reference/transaction-status", transactionStatus);
app.use("/reference/vehicle-type", vehicleType);
app.use("/reference/transactions", transactions);
app.use("/reference/fuel-type", fuelType);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server running on port " + PORT));
