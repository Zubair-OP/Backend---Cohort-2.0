import { body, Result } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const productValidator = [
  body("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters long"),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters long"),
  body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
  body("priceCurrency").notEmpty().withMessage("Price currency is required"),

  validateRequest,
];
