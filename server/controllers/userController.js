const userRepository = require('../repository/userRepository');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userRepository.findById(req.user._id);
      res.status(200).json(new ApiResponse(200, user, 'Profile details'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, phone, avatar } = req.body;
      const updatedUser = await userRepository.updateById(req.user._id, {
        name,
        phone,
        avatar,
      });
      res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async addFunds(req, res, next) {
    try {
      const { amount } = req.body;
      const numAmount = Number(amount);
      if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
        throw new ApiError(400, 'Invalid deposit amount');
      }

      const updatedUser = await userRepository.updateWallet(req.user._id, numAmount);
      if (!updatedUser) {
        throw new ApiError(500, 'Failed to update wallet balance');
      }
      res.status(200).json(new ApiResponse(200, updatedUser, `Successfully added $${numAmount.toLocaleString()} to wallet`));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
