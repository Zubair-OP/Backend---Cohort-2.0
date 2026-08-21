import { Router } from "express";
const router = Router();
import multer from "multer";
import { addProduct, getAllProducts, getAllProductslist, filterProducts, getProductById, addProductVariant, updateProductVariant, deleteProductVariant } from "../controllers/product.controller.js";
import { authenticateSeller } from "../middleware/auth.middlleware.js";
import { productValidator } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 7 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

router.post('/add', authenticateSeller, upload.array('images', 7), productValidator, addProduct);
router.get('/list', authenticateSeller, getAllProducts);
router.get('/user-list', getAllProductslist);
router.get('/filter', filterProducts);
router.get('/details/:id', getProductById);
router.post('/variants/:productId', authenticateSeller, upload.array('images', 7), addProductVariant);
router.put('/variants/:productId/:variantId', authenticateSeller, updateProductVariant);
router.delete('/variants/:productId/:variantId', authenticateSeller, deleteProductVariant);

export default router;
