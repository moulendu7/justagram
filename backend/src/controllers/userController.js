const User = require("../models/User");
const Activity = require("../models/Activity");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username = req.body.username || user.username;

    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        message: "Target user not found",
      });
    }

    const alreadyFollowing = currentUser.following.includes(targetUser._id);

    if (alreadyFollowing) {
      currentUser.following.pull(targetUser._id);

      targetUser.followers.pull(currentUser._id);

      await currentUser.save();

      await targetUser.save();

      return res.status(200).json({
        message: "User unfollowed",
      });
    }

    currentUser.following.push(targetUser._id);

    targetUser.followers.push(currentUser._id);

    await currentUser.save();

    await targetUser.save();

    res.status(200).json({
      message: "User followed",
    });
    await Activity.create({
      user: req.user._id,
      type: "follow",
      targetUser: targetUser._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMe,
  getUserProfile,
  updateProfile,
  followUser,
};
