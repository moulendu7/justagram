const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = await Message.create({
      sender: req.user._id,

      receiver: receiverId,

      text,
    });
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
    message.isSeen = true;
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
module.exports = {
  sendMessage,
  getConversation,
  markAsSeen,
  deleteMessageForEveryone
};