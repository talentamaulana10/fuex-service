const express = require("express");
const router = express.Router();
const TransactionStatus = require("../models/TransactionStatus");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBTransactionStatusInteraction = await TransactionStatus.find({});
    if (DBTransactionStatusInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionStatusInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBTransactionStatusInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const DBTransactionStatusInteraction = await TransactionStatus.findById(req.params.id);
    if (DBTransactionStatusInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionStatusInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "DATA NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = ` ${error}`;
    res.json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  try {
    const newTransactionStatus = new TransactionStatus({
      name: req.body.name,
      code: req.body.code,
    });
    const DBTransactionStatusInteraction = await newTransactionStatus.save();
    if (DBTransactionStatusInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionStatusInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBTransactionStatusInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
