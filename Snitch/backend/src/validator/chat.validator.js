import { body, validationResult } from "express-validator";

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
    .withMessage("Message must be 500 characters or fewer"),

  // Optional client-provided identifiers — keep them short and safe.
  body("sessionId").optional().trim().isLength({ max: 100 }).escape(),
  body("visitorId").optional().trim().isLength({ max: 100 }).escape(),

  validateRequest,
];
