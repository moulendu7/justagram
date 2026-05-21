const Group = require("../models/Group");
const GroupMessage = require("../models/GroupMessage");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await Group.create({
      name,
      admin: req.user._id,
      members: [req.user._id, ...members],
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    })
      .populate("members", "username avatar")
      .populate("admin", "username avatar");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const sendGroupMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    const message = await GroupMessage.create({
      group: group._id,

      sender: req.user._id,

      text,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.find({
      group: req.params.groupId,
    })
      .populate("sender", "username avatar")
      .sort({
        createdAt: 1,
      });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createGroup,
  getUserGroups,
  sendGroupMessage,
  getGroupMessages,
};
