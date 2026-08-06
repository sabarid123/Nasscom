const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const data = await authService.registerUser(req.body);
      res.status(201).json(new ApiResponse(201, data, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.loginUser(email, password);
      res.status(200).json(new ApiResponse(200, data, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await authService.refreshToken(refreshToken);
      res.status(200).json(new ApiResponse(200, data, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user._id, oldPassword, newPassword);
      res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      res.status(200).json(new ApiResponse(200, req.user, 'Current user profile'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
