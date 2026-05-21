const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAvatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Group", groupSchema);
