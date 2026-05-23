const Call = require("../models/Call");

const createCallLog = async (req, res) => {
  try {
    const call = await Call.create({
      caller: req.user._id,
      receiver: req.body.receiverId,
      callType: req.body.callType,
      status: req.body.status,
      duration: req.body.duration || 0,
    });
    res.status(201).json(call);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getCallHistory = async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [
        {
          caller: req.user._id,
        },
        {
          receiver: req.user._id,
        },
      ],
    })
      .populate("caller receiver", "username avatar")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createCallLog,
  getCallHistory,
};
