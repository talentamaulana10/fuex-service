const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TransactionSchema = new schema({
  buyer: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  deliverycost: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  adminfee: {
    type: String,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  numberPlate: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
});

module.exports = Transaction = mongoose.model(
  "transactions",
  TransactionSchema
);
