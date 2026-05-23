const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });
    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, receiverId],
      },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        lastMessage: message._id,
        unreadCounts: {
          [receiverId]: 1,
        },
      });
    } else {
      conversation.lastMessage = message._id;
      const currentUnread = conversation.unreadCounts.get(receiverId) || 0;
      conversation.unreadCounts.set(receiverId, currentUnread + 1);
      await conversation.save();
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: req.params.userId,
        },
        {
          sender: req.params.userId,
          receiver: req.user._id,
        },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const markAsSeen = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    message.status = "seen";
    await message.save();
    res.status(200).json({
      message: "Message marked as seen",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteMessageForEveryone = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    message.text = "This message was deleted";
    message.isDeleted = true;
    await message.save();
    res.status(200).json({
      message: "Message deleted for everyone",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    message.reactions.push({
      user: req.user._id,

      emoji,
    });
    await message.save();
    res.status(200).json({
      message: "Reaction added",

      reactions: message.reactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const searchMessages = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        message: "Search query required",
      });
    }
    const messages = await Message.find({
      text: {
        $regex: query,
        $options: "i",
      },
      $or: [
        {
          sender: req.user._id,
        },
        {
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender receiver", "username avatar")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const togglePinMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    message.isPinned = !message.isPinned;
    await message.save();
    res.status(200).json({
      message: message.isPinned ? "Message pinned" : "Message unpinned",
      isPinned: message.isPinned,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  sendMessage,
  getConversation,
  markAsSeen,
  deleteMessageForEveryone,
  reactToMessage,
  searchMessages,
  togglePinMessage,
};
