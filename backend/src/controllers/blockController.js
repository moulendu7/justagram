const Block = require("../models/Block");

const blockUser = async (req, res) => {
  try {
    const existingBlock = await Block.findOne({
      blocker: req.user._id,

      blocked: req.params.userId,
    });
    if (existingBlock) {
      return res.status(400).json({
        message: "User already blocked",
      });
    }
    const block = await Block.create({
      blocker: req.user._id,

      blocked: req.params.userId,
    });
    res.status(201).json({
      message: "User blocked",
      block,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const unblockUser = async (req, res) => {
  try {
    const block = await Block.findOne({
      blocker: req.user._id,

      blocked: req.params.userId,
    });
    if (!block) {
      return res.status(404).json({
        message: "Block not found",
      });
    }
    await block.deleteOne();
    res.status(200).json({
      message: "User unblocked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await Block.find({
      blocker: req.user._id,
    }).populate("blocked", "username avatar");
    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  blockUser,
  unblockUser,
  getBlockedUsers,
};
