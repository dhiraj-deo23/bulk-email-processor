const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGODB_URL);
} catch (error) {
  console.log(error);
}

mongoose.connection.on("error", (err) => {
  console.log(err);
});
