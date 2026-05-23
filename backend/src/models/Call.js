const mongoose = require("mongoose");

const callSchema = mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callType: {
      type: String,
      enum: ["voice", "video"],

      required: true,
    },
    status: {
      type: String,
      enum: ["missed", "accepted", "rejected", "ended"],
      default: "missed",
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Call", callSchema);
