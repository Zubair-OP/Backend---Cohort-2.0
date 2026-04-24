import { Router } from "express";
const router = Router();
import multer from "multer";
import { addProduct } from "../controllers/product.controller.js";
import { authenticateSeller } from "../middleware/auth.middlleware.js";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 7 * 1024 * 1024 },
})

router.post('/add', authenticateSeller, upload.array('images', 5), addProduct);


export default router;