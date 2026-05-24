import express from "express";
import { authenticateUser } from "../middleware/auth.middlleware.js";
import {
    addToCart,
    addToCartNoVariant,
    getCart,
    clearCart,
    incrementCartItem,
    incrementCartItemNoVariant,
    decrementCartItem,
    decrementCartItemNoVariant,
} from "../controllers/cart.controller.js";
import { addToCartValidator, addToCartNoVariantValidator } from "../validator/cart.validator.js";

const router = express.Router();

// With variant
router.post('/add/:productId/:variantId', authenticateUser, addToCartValidator, addToCart);
router.patch('/increment/:productId/:variantId', authenticateUser, incrementCartItem);
router.patch('/decrement/:productId/:variantId', authenticateUser, decrementCartItem);

// Without variant (products with no variants)
router.post('/add/:productId', authenticateUser, addToCartNoVariantValidator, addToCartNoVariant);
router.patch('/increment/:productId', authenticateUser, incrementCartItemNoVariant);
router.patch('/decrement/:productId', authenticateUser, decrementCartItemNoVariant);

router.get('/get', authenticateUser, getCart);
router.delete('/clear', authenticateUser, clearCart);

export default router;
