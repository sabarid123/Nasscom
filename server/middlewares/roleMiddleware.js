const ApiError = require('../utils/apiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};

module.exports = { authorize };
