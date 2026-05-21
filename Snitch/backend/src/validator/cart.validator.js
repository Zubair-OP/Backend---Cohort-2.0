import { body, param,validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

export const addToCartValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").isMongoId().withMessage("Invalid variant ID"),
    body("quantity").isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest,
];

export const addToCartNoVariantValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest,
];