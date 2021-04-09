const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TransactionStatusSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = TransactionStatus = mongoose.model(
  "transaction_status",
  TransactionStatusSchema
);
