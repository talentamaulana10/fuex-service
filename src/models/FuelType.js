const mongoose = require("mongoose");
const schema = mongoose.Schema;

const FuelTypeSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = FuelType = mongoose.model("fuel_type", FuelTypeSchema);
