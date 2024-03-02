const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const registerSchema = new Schema({
  name: {
    type: String,
    max: 32,
    required: true,
    min: 6,
  },
  mobile: {
    type: String,
    max: 32,
    required: true,
    min: 6,
  },
  email: {
    type: String,
    required: true,
    max: 32,
  },
  password: {
    type: String,
    max: 1022,
    min: 8,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});


const loginSchema = new Schema({
  
  registration_Id: {
    type:ObjectId,
    required:true,
    max:9999,
  },
  email: {
    type: String,
    required: true,
    max: 32,
  },
  token: {
    type: String,
    max: 10220,
    min: 8,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  register: mongoose.model("register", registerSchema),
  login: mongoose.model("login", loginSchema),
};