const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
    text: {
      type: String,

      required: true,
    },

    isSeen: {
      type: Boolean,

      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", messageSchema);
