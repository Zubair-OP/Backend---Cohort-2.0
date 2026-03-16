import { body, query, validationResult } from 'express-validator';

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
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long');

export const registerValidator = [
    usernameValidation,
    emailValidation,
    passwordValidation,
];

export const loginValidator = [
    emailValidation,
    body('password').notEmpty().withMessage('Password is required'),
];

export const verifyEmailValidator = [
    query('token').notEmpty().withMessage('Verification token is required'),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        })),
    });
};