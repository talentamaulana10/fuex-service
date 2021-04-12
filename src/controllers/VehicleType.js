const express = require("express");
const router = express.Router();
const VehicleType = require("../models/VehicleType");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBVehicleTypeInteraction = await VehicleType.find({});
    if (DBVehicleTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBVehicleTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBVehicleTypeInteraction;
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
    const newVehicleType = new VehicleType({
      name: req.body.name,
      code: req.body.code,
    });
    const DBVehicleTypeInteraction = await newVehicleType.save();
    if (DBVehicleTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBVehicleTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBVehicleTypeInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
