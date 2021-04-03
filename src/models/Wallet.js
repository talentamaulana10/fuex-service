const mongoose = require("mongoose");
const schema = mongoose.Schema;

const WalletSchema = new schema({
  balance: {
    type: Number,
    required: false,
  },
});

module.exports = Wallet = mongoose.model("wallet", WalletSchema);
