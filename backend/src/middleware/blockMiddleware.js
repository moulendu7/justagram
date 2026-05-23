const Block = require("../models/Block");

const checkBlock = async (req, res, next) => {
  try {
    const targetUserId =
      req.body.receiverId || req.body.userId || req.params.userId;
    if (!targetUserId) {
      return next();
    }
    const isBlocked = await Block.findOne({
      $or: [
        {
          blocker: req.user._id,
          blocked: targetUserId,
        },
        {
          blocker: targetUserId,

          blocked: req.user._id,
        },
      ],
    });
    if (isBlocked) {
      return res.status(403).json({
        message: "Interaction blocked",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = checkBlock;
