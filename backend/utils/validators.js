const { body } = require('express-validator');
exports.registerValidator = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 chars'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  body('gender').isIn(['male','female','other']).withMessage('Gender invalid')
];
exports.loginValidator = [
  body('email').isEmail().withMessage('Email invalid'),
  body('password').exists().withMessage('Password required')
];
exports.recordValidator = [
  body('name').isLength({ min: 1 }).withMessage('Name required'),
  body('category').isMongoId().withMessage('Category invalid'),
  body('active').isBoolean().optional()
];

//npm i joi
