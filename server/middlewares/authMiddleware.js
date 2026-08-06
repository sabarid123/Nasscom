const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');
const ApiError = require('../utils/apiError');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_production_ready_2026'
      );

      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return next(new ApiError(401, 'User not found or account deactivated'));
      }

      if (user.status === 'SUSPENDED') {
        return next(new ApiError(403, 'Your account has been suspended'));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized, token failed or expired'));
    }
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided'));
  }
};

module.exports = { protect };
