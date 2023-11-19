const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoDB_URL);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Error while connecting MongoDB!", error);
  }
};
module.exports = connectDB;
