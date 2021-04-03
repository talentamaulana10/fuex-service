const mongoose = require("mongoose");
const schema = mongoose.Schema;

const WalletHitorySchema = new schema({
  wallet: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = WalletHitory = mongoose.model(
  "wallethistory",
  WalletHitorySchema
);
