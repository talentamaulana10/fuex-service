const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const UserType = require("../models/UserType");
const ServiceUsers = require("../services/User");
const responseTemplate = require("../response-templates");

router.get(`/:id`, async (req, res) => {
  try {
    const DbUserInteraction = await User.findById(req.params.id);
    if (DbUserInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DbUserInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DbUserInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  const mobilePhoneNumber = req.body.mobilePhoneNumber;
  const username = req.body.username;
  const password = req.body.password;
  const userType = req.body.userType;
  try {
    const response = await User.findOne({
      mobilePhoneNumber: mobilePhoneNumber,
      username: username,
    });

    if (response) {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "DATA ALREADY EXITS";
      res.status(200).json(templateResponse);
    } else {
      try {
        const DBUserTypeInteraction = await UserType.findOne({
          code: userType,
        });
        if (DBUserTypeInteraction) {
          const newWallet = new Wallet({
            balance: 0,
          });
          try {
            const DbWalletInteraction = await newWallet.save();
            if (DbWalletInteraction) {
              try {
                const newUser = new User({
                  username: username,
                  password: password,
                  mobilePhoneNumber: mobilePhoneNumber,
                  wallet: DbWalletInteraction._id,
                  userType: userType,
                });
                const DbUserInteraction = await newUser.save();
                if (DbUserInteraction) {
                  const templateResponse = responseTemplate.success;
                  templateResponse.data = DbUserInteraction;
                  res.status(200).json(templateResponse);
                } else {
                  const templateResponse = responseTemplate.error;
                  templateResponse.message = "FAILED GENERATE USER";
                  res.status(200).json(templateResponse);
                }
              } catch (error) {
                const templateResponse = responseTemplate.error;
                templateResponse.message = error;
                res.json(templateResponse);
              }
            } else {
              const templateResponse = responseTemplate.error;
              templateResponse.message = "FAILED GENERATE WALLET";
              res.status(200).json(templateResponse);
            }
          } catch (error) {
            const templateResponse = responseTemplate.error;
            templateResponse.message = error;
            res.json(templateResponse);
          }
        } else {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "USER TYPE NOT FOUND";
          res.status(200).json(templateResponse);
        }
      } catch (error) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = error;
        res.json(templateResponse);
      }
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.post("/login", async (req, res) => {
  try {
    const response = await ServiceUsers.Login({
      username: req.body.username,
      password: req.body.password,
    });
    if (response) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = response;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "Username Or Password Not Match";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
