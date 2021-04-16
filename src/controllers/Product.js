const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const responseTemplate = require("../response-templates");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const DBProductInteraction = await Product.find({});
    if (DBProductInteraction && DBProductInteraction.length !== 0) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBProductInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "DATA NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  const { name, seller, price } = req.body;
  try {
    const DBUserInteraction = User.findById(seller);
    if (DBUserInteraction) {
      try {
        const newProduct = new Product({
          name: name,
          seller: seller,
          price: price,
        });
        const DBProductInteraction = await newProduct.save();
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
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "SELLER NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
