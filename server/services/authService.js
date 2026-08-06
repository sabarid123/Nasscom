const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');
const ApiError = require('../utils/apiError');

class AuthService {
  generateTokens(user) {
    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey_production_ready_2026', {
      expiresIn: process.env.JWT_EXPIRE || '24h',
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey_production_ready_2026',
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    return { accessToken, refreshToken };
  }

  async registerUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }
    const user = await userRepository.create(userData);
    const tokens = this.generateTokens(user);

    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, ...tokens };
  }

  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'Your account has been suspended. Please contact support.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = this.generateTokens(user);

    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, ...tokens };
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey_production_ready_2026'
      );
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }
      return this.generateTokens(user);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findById(userId);
    const userWithPassword = await userRepository.findByEmail(user.email, true);
    
    const isMatch = await userWithPassword.matchPassword(oldPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    userWithPassword.password = newPassword;
    await userWithPassword.save();
    return true;
  }
}

module.exports = new AuthService();
