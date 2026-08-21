import ProductModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.services.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const addProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency, category } = req.body;
    const sellerId = req.user._id;
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = await Promise.all(
      files.map(async (image) => {
        const uploadedImage = await uploadImage(image);
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
      category,
      sellerId,
      images,
    });

    res.status(201).json({
      message: "Product added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("addProduct failed:", error.message);
    res.status(500).json({ message: "Failed to add product" });
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
    console.error("getAllProducts failed:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
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
    console.error("getAllProductslist failed:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const { category = "all", search = "", sortBy = "latest" } = req.query;
    const normalizedSearch = search.trim();
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (normalizedSearch) {
      const safeSearch = escapeRegex(normalizedSearch);
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const sortOptions = {
      latest: { createdAt: -1 },
      "price-low": { "price.amount": 1, createdAt: -1 },
      "price-high": { "price.amount": -1, createdAt: -1 },
    };

    const products = await ProductModel.find(query)
      .sort(sortOptions[sortBy] || sortOptions.latest)
      .limit(100)
      .lean();

    res.status(200).json({
      message: "Filtered products fetched successfully",
      success: true,
      count: products.length,
      appliedFilters: {
        category,
        search: normalizedSearch,
        sortBy,
      },
      products,
    });
  } catch (error) {
    console.error("filterProducts failed:", error.message);
    res.status(500).json({ message: "Failed to filter products" });
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
    console.error("getProductById failed:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export async function addProductVariant(req, res) {
  try {
    const productId = req.params.productId;

    const product = await ProductModel.findOne({
      _id: productId,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const files = req.files || [];
    const images = [];

    if (files.length > 0) {
      const uploaded = await Promise.all(
        files.map((file) => uploadImage(file))
      );
      uploaded.forEach((img) => images.push({ url: img.url }));
    }

    let attributes = {};
    try {
      attributes = JSON.parse(req.body.attributes || "{}");
    } catch {
      return res.status(400).json({ message: "Invalid attributes JSON" });
    }

    product.variants.push({
      images,
      price: {
        amount: Number(req.body.priceAmount) || product.price.amount,
        currency: req.body.priceCurrency || product.price.currency,
      },
      stock: Number(req.body.stock) || 0,
      attributes,
    });

    await product.save();

    return res.status(200).json({
      message: "Product variant added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("addProductVariant failed:", error.message);
    res.status(500).json({ message: "Failed to add variant" });
  }
}

export async function updateProductVariant(req, res) {
  try {
    const { productId, variantId } = req.params;

    const product = await ProductModel.findOne({ _id: productId, sellerId: req.user._id });
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found", success: false });
    }

    if (req.body.stock !== undefined) variant.stock = Number(req.body.stock);
    if (req.body.priceAmount) {
      variant.price = {
        amount: Number(req.body.priceAmount),
        currency: req.body.priceCurrency || variant.price?.currency || product.price.currency,
      };
    }
    if (req.body.attributes) {
      try {
        variant.attributes = JSON.parse(req.body.attributes);
      } catch {
        return res.status(400).json({ message: "Invalid attributes JSON" });
      }
    }

    await product.save();

    return res.status(200).json({ message: "Variant updated successfully", success: true, product });
  } catch (error) {
    console.error("updateProductVariant failed:", error.message);
    res.status(500).json({ message: "Failed to update variant" });
  }
}

export async function deleteProductVariant(req, res) {
  try {
    const { productId, variantId } = req.params;

    const product = await ProductModel.findOne({ _id: productId, sellerId: req.user._id });
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    product.variants.pull({ _id: variantId });
    await product.save();

    return res.status(200).json({ message: "Variant deleted successfully", success: true, product });
  } catch (error) {
    console.error("deleteProductVariant failed:", error.message);
    res.status(500).json({ message: "Failed to delete variant" });
  }
}
