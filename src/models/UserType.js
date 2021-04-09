const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserTypeSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = UserType = mongoose.model("user_type", UserTypeSchema);
