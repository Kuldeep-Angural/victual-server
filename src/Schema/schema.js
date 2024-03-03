const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({

  _id : {
    type: String,
    max: 39892,
    required: true,
    min: 6,
  },

  name: {
    type: String,
    max: 32,
    required: true,
    min: 6,
  },
  mobile: {
    type: String,
    max: 32,
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
    required: false,
  },

  isGoogleRegister : {
    type : Boolean
  },

  googlePhoto : {
    type: String,
    max: 10220,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
     type: Date,
     required: true,
     default: Date.now 
    }
});


const loginSchema = new Schema({
  
  registration_Id: {
    type:String,
    required:true,
    max:9999,
  },

  isGoogleLogin : {
    type : Boolean
  },

  googlePhoto : {
    type: String,
    max: 10220,
  },


  name : {
    type: String,
    required: true,
    max: 10220,
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
  user: mongoose.model("user", userSchema),
  login: mongoose.model("login", loginSchema),
};