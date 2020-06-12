const mongoose = require("mongoose");

//dummy models for testing purpose
const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
