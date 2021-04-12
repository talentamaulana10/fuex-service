const mongoose = require("mongoose");
const schema = mongoose.Schema;

const VehicleTypeSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = VehicleType = mongoose.model(
  "vehicle_type",
  VehicleTypeSchema
);
