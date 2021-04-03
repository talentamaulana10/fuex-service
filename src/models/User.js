const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobilePhoneNumber: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
    required: false,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
