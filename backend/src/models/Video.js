const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    shares: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Video", videoSchema);
