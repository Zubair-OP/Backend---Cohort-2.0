import { body, validationResult } from 'express-validator';

const usernameValidation = body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscore');

const emailValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();

const passwordValidation = body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const registerValidator = [
    usernameValidation,
    emailValidation,
    passwordValidation,
];

export const loginValidator = [
    emailValidation,
    body('password').notEmpty().withMessage('Password is required'),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        })),
    });
};
