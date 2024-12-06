const asyncHandler = require("express-async-handler");
const { createRoundLogic } = require("../scripts/createRound");

const createRound = asyncHandler(async (req, res, next) => {
  try {
    await createRoundLogic();
    res.status(200).json({
      success: {
        status: true,
        message: "Rodada criada com sucesso!",
      },
      failed: null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { createRound };
