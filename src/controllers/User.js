const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", (req, res) => {
  const mobilePhoneNumber = req.body.mobilePhoneNumber;
  User.findOne({ mobilePhoneNumber: mobilePhoneNumber }).then((response) => {
    if (response) {
      return res.json({
        message: "USER ALREADY EXIST",
        code: "USER ALREADY EXIST",
        status: "ERROR",
      });
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        mobilePhoneNumber: req.body.mobilePhoneNumber,
        type: req.body.type,
        wallet: req.body.wallet,
      });
      newUser
        .save()
        .then((DBinteraction) => {
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
        })
        .catch((err) => {
          res.status(200).json(err);
        });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({
    username: req.body.username,
    password: req.body.password,
  })
    .then((DBinteraction) => {
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
    })
    .catch((err) => {
      res.status(200).json(err);
    });
});

module.exports = router;
