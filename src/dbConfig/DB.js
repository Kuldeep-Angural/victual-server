const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const DBCONNECTON = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    await mongoose.connect(uri);
    console.log("Database connected successfully😊");
  } catch (err) {
    console.error("MongoDB connection error:❌", err);
    process.exit(1);
  }
};

module.exports = DBCONNECTON;
