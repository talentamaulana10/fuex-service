const express = require("express");
const router = express.Router();
const UserType = require("../models/UserType");
const responseTemplate = require("../response-templates");

router.get("/", async (req, res) => {
  try {
    const DBUserTypeInteraction = await UserType.find({});
    if (DBUserTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBUserTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBUserTypeInteraction;
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
    const newUserType = new UserType({
      name: req.body.name,
      code: req.body.code,
    });
    const DBUserTypeInteraction = await newUserType.save();
    if (DBUserTypeInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBUserTypeInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBUserTypeInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

module.exports = router;
