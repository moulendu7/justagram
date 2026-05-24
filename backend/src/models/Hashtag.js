const mongoose = require("mongoose");
const hashtagSchema = mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
    },
    usageCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Hashtag", hashtagSchema);
