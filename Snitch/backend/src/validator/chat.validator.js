import { body, validationResult } from "express-validator";

const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const chatValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 500 })
    .withMessage("Message must be 500 characters or fewer")
    .customSanitizer((value) => String(value).replace(CONTROL_CHARS, "").trim()),

  body("sessionId").optional().trim().isLength({ max: 100 }).escape(),
  body("visitorId").optional().trim().isLength({ max: 100 }).escape(),

  validateRequest,
];
