const User = require("../models/User");
const Wallet = require("../models/Wallet");

module.exports = {
  Login(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const DBinteraction = await User.findOne(payload);
        resolve(DBinteraction);
      } catch (error) {
        reject(error);
      }
    });
  },
  checkingAvailibilityUserForRegister(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const DBinteraction = await User.findOne(payload);
        resolve(DBinteraction);
      } catch (error) {
        reject(error);
      }
    });
  },
};
