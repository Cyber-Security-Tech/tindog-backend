// src/middleware/validateMiddleware.js

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map(err => ({ field: err.param, message: err.msg }));
    return res.status(400).json({ errors: extracted });
  }
  next();
};

module.exports = validate;
