const express = require("express");
const router = express.Router();
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
  try {
    const newTransaction = new Transaction({
      vehicleName: req.body.vehicleName,
      vehicleType: req.body.vehicleType,
      numberPlate: req.body.numberPlate,
    });
    const DBTransactionInteraction = await newTransaction.save();
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

module.exports = router;
