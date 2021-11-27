const mongoose = require("mongoose");

let emailSchema = mongoose.Schema({
  to: String,
  from: String,
  subject: String,
  html: String,
  text: String,
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
