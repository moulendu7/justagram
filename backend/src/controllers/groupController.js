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
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin can add members",
      });
    }
    if (group.members.includes(userId)) {
      return res.status(400).json({
        message: "User already in group",
      });
    }
    group.members.push(userId);
    await group.save();
    res.status(200).json({
      message: "Member added",

      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin can remove members",
      });
    }
    group.members = group.members.filter(
      (member) => member.toString() !== userId,
    );
    await group.save();
    res.status(200).json({
      message: "Member removed",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const promoteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin can promote",
      });
    }
    group.admin = userId;
    await group.save();
    res.status(200).json({
      message: "Admin updated",

      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    group.members = group.members.filter(
      (member) => member.toString() !== req.user._id.toString(),
    );
    await group.save();
    res.status(200).json({
      message: "Left group",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin can delete",
      });
    }
    await GroupMessage.deleteMany({
      group: group._id,
    });
    await group.deleteOne();
    res.status(200).json({
      message: "Group deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin allowed",
      });
    }
    if (group.moderators.includes(userId)) {
      return res.status(400).json({
        message: "Already moderator",
      });
    }
    group.moderators.push(userId);
    await group.save();
    res.status(200).json({
      message: "Moderator added",

      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const removeModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin allowed",
      });
    }
    group.moderators = group.moderators.filter(
      (mod) => mod.toString() !== userId,
    );
    await group.save();
    res.status(200).json({
      message: "Moderator removed",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const muteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    const isModerator = group.moderators.includes(req.user._id);
    const isAdmin = group.admin.toString() === req.user._id.toString();
    if (!isAdmin && !isModerator) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    if (group.mutedUsers.includes(userId)) {
      return res.status(400).json({
        message: "Already muted",
      });
    }
    group.mutedUsers.push(userId);
    await group.save();
    res.status(200).json({
      message: "User muted",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const toggleAdminOnlyMessages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Only admin allowed",
      });
    }
    group.adminOnlyMessages = !group.adminOnlyMessages;
    await group.save();
    res.status(200).json({
      adminOnlyMessages: group.adminOnlyMessages,
    });
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
  addMember,
  removeMember,
  promoteAdmin,
  leaveGroup,
  deleteGroup,
  addModerator,
  removeModerator,
  muteUser,
  toggleAdminOnlyMessages,
};
