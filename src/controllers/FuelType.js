const express = require("express");
const router = express.Router();
const FuelType = require("../models/FuelType");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBFuelTypeInteraction = await FuelType.find({});
    if (DBFuelTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBFuelTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBFuelTypeInteraction;
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
    const newFuelType = new FuelType({
      name: req.body.name,
      code: req.body.code,
    });
    const DBFuelTypeInteraction = await newFuelType.save();
    if (DBFuelTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBFuelTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBFuelTypeInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
