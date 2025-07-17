const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Pass the validation error to the global error handler
    const error = new Error('Validation failed');
    error.status = 400;
    error.details = errors.array(); // Attach validation error details
    return next(error);
  }
  next();
};

module.exports = validateRequest;

