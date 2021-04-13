const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBProductInteraction = await Product.find({});
    if (DBProductInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBProductInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBProductInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  var { name, seller, price } = req.body;
  try {
    const DBProductInteraction = await Product.findById(product);
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
