const Conversation = require("../models/Conversation");

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username avatar")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender receiver",
          select: "username avatar",
        },
      })
      .sort({
        updatedAt: -1,
      });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const resetUnreadCount = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    conversation.unreadCounts.set(req.user._id.toString(), 0);
    await conversation.save();
    res.status(200).json({
      message: "Unread count reset",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getConversations,
  resetUnreadCount,
};
