const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const responseTemplate = require("../response-templates");

router.get("/:id", async (req, res) => {
  try {
    const DBWalletInteraction = await Wallet.findById(req.params.id);
    if (DBWalletInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBWalletInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBWalletInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
