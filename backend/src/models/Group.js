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
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],
    mutedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],
    adminOnlyMessages: {
      type: Boolean,
      default: false,
    },
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
