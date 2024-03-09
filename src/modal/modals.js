const { ObjectId, Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
      unique: true,
      max: 32,
    },

    password: {
      type: String,
      max: 1022,
      min: 8,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    roles: {
      type: [String],
      enum: ["user", "seller","admin","owner"],
      default: ["user"],
    },
  },
);

const loginSchema = new Schema({
  registration_Id: {
    type: String,
    required: true,
    max: 9999,
  },

  isGoogleLogin: {
    type: Boolean,
  },

  googlePhoto: {
    type: String,
    max: 10220,
  },

  name: {
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



const userTokenSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    require:true,
  },
  token: {
    type:String,
    require:true,
  },
  createdAt: {
    type: Date,
    default:Date.now,
    expires:30*86400 // 30 days
  }
});

module.exports = {
  user: mongoose.model("user", userSchema),
  // login: mongoose.model("login", loginSchema),
  userToken:mongoose.model("userToken",userTokenSchema),
};
