const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TransactionSchema = new schema({
  buyer: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: String,
    required: true,
  },
  deliveryCost: {
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
  adminFee: {
    type: String,
    required: true,
  },
  resi: {
    type: String,
    required: true,
  },
});

module.exports = Transaction = mongoose.model(
  "transactions",
  TransactionSchema
);
