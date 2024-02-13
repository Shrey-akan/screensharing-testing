import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
  },
 
  expiryDate:{
    type: Date,
    default: Date.now() + (15 * 24 * 60 * 60 * 1000),
  }
});

tokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model("RefreshToken", tokenSchema);