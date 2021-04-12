const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBTransactionInteraction = await Transaction.find({});
    if (DBTransactionInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBTransactionInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  var {
    vehicleName,
    vehicleType,
    numberPlate,
    buyer,
    product,
    deliveryCost,
    address,
    adminFee,
  } = req.body;
  try {
    const DBUserTypeInteraction = await User.findById(buyer);
    if (DBUserTypeInteraction) {
      try {
        const DBFuelTypeInteraction = await FuelType.findById(fuelType);
        if (DBFuelTypeInteraction) {
        } else {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "FUEL TYPE NOT FOUND";
          res.status(200).json(templateResponse);
        }
      } catch (error) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = error;
        res.status(200).json(templateResponse);
      }
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "USER NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.status(200).json(templateResponse);
  }
});

module.exports = router;
