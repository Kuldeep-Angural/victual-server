import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      max: 32,
      min: 6,
    },

    mobile: {
      type: String,
      max: 32,
      min: 6,
    },

    email: {
      type: String,
      unique: true,
      max: 32,
    },


    createdAt: {
      type: Date,
      default: Date.now,
    },


    refreshToken: {
      type: String,
      max: 898898898,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      required: false,
    },

    profilePic: {
      type: String,
      required: false,
    },

    verificationCode: {
      type: Number,
      max: 99989798,
    },

    verificationExpiryTime: {
      type: String,
      required: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    roles: {
      type: [String],
      enum: ["user", "seller", "admin", "owner"],
      default: ["user"],
    },
  },
);

export default mongoose.model("User", userSchema);