import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({

  brodCastId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Screen = mongoose.model("Screen", screenSchema);