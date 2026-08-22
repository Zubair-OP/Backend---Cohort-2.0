import { body, param, validationResult } from "express-validator";

function isMongoIdOrEmpty(value) {
  if (value === null || value === undefined || value === "") return true;
  return /^[a-f\d]{24}$/i.test(value);
}

export const messageValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 10000 })
    .withMessage("Message must be 10,000 characters or fewer"),
  body("chat")
    .custom(isMongoIdOrEmpty)
    .withMessage("Invalid chat ID format"),
];

export const chatIdValidator = [
  param("Id")
    .isMongoId()
    .withMessage("Invalid chat ID format"),
];

export const handleChatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    })),
  });
};
