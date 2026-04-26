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

export const getAllProducts = async (req, res) => {
  try {
    const seller = req.user;

    const products = await ProductModel.find({ sellerId: seller._id }).lean();

    res.status(200).json({
      message: "All products are fetched",
      success: true,
      products,
    });
  } catch (error) {
    console.error("getAllProducts failed:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message || "Unknown error",
    });
  }
};

export const getAllProductslist = async (req, res) => {
  try {
    const products = await ProductModel.find().lean();

    res.status(200).json({
      message: "All products are fetched",
      success: true,
      products,
    });
  } catch (error) {
    console.error("getAllProductsForUser failed:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message || "Unknown error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("getProductById failed:", error);
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message || "Unknown error",
    });
  }
};
