const mongoose = require("mongoose");
const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "save",
        "view",
        "share",
        "follow"
      ],
      required: true
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },

  {
    timestamps: true
  }
);
module.exports = mongoose.model(
  "Activity",
  activitySchema
);