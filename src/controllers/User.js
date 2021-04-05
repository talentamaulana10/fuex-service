const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const mobilePhoneNumber = req.body.mobilePhoneNumber;
  const username = req.body.username;
  const password = req.body.password;
  const type = req.body.type;
  const wallet = req.body.wallet;
  try {
    const response = await User.findOne({
      mobilePhoneNumber: mobilePhoneNumber,
      username: username,
    });
    console.log(response);
    if (response) {
      return res.json({
        message: "USER ALREADY EXIST",
        code: "USER ALREADY EXIST",
        status: "ERROR",
      });
    } else {
      const newUser = new User({
        username: username,
        password: password,
        mobilePhoneNumber: mobilePhoneNumber,
        type: type,
        wallet: wallet,
      });
      try {
        const DBinteraction = await newUser.save();
        if (DBinteraction) {
          res.status(200).json({
            status: "SUCCESS",
            message: "SUCCESS",
            data: DBinteraction,
          });
        } else {
          res.status(200).json({
            status: "ERROR",
            message: "ERROR",
            data: DBinteraction,
          });
        }
      } catch (error) {
        res.json({
          status: "ERROR",
          message: `${error}`,
          data: DBinteraction,
        });
      }
    }
  } catch (error) {
    res.json({
      status: "ERROR",
      message: `${error}`,
      data: DBinteraction,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const DBinteraction = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(DBinteraction);
    if (DBinteraction) {
      res.status(200).json({
        status: "SUCCESS",
        message: "SUCCESS",
        data: DBinteraction,
      });
    } else {
      res.status(200).json({
        status: "ERROR",
        message: "Username Or Password Match",
        data: DBinteraction,
      });
    }
  } catch (error) {
    res.json({
      status: "ERROR",
      message: `${error}`,
      data: DBinteraction,
    });
  }
});

module.exports = router;
