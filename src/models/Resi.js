const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ResiSchema = new schema({
  sender: {
    type: "String",
    required: true,
  },
  receiver: {
    type: "String",
    required: true,
  },
  deliveryCost: {
    type: "Number",
    required: true,
  },
  address: {
    type: "String",
    required: true,
  },
  isDelivered: {
    type: Boolean,
    required: false,
  },
});

module.exports = Resi = mongoose.model("resi", ResiSchema);
