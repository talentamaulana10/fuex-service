const express = require("express");

const config = require("./config/keys").mongoURI;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const users = require("./controllers/User");

const path = require("path");

mongoose
  .connect(config, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb Successfuly Connect !"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/users", users);

app.us;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server running on port" + PORT));
