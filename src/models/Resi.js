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
});

module.exports = Resi = mongoose.model("resi", ResiSchema);
