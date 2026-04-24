import ProductModel from "../models/product.model.js";
import {uploadImage} from "../services/storage.services.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const sellerId = req.user._id;
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = await Promise.all(
      files.map(async (image) => {
        const uploadedImage = await uploadImage({
          buffer: image.buffer,
        });

        return {
          url: uploadedImage.url,
          fileId: uploadedImage.fileId,
        };
      }),
    );

    const product = await ProductModel.create({
      title,
      description,
      price: {
        amount: Number(priceAmount),
        currency: priceCurrency || "PKR",
      },
      sellerId,
      images,
    });

    res.status(201).json({
      message: "Product added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("addProduct failed:", {
      message: error.message,
      status: error.status,
      cause: error.cause?.message,
      stack: error.stack,
    });

    res
      .status(500)
      .json({
        message: "Failed to add product",
        error: error.message || "Unknown error",
      });
  }
};
