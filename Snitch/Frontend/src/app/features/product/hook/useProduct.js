import {
  getAllProducts,
  createProduct,
  getProductById,
  getallProductslistUser,
  getFilteredProducts,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../services/product.Api";

import { setLoading, setProducts } from "../../product/state/product.slice";

import { useDispatch } from "react-redux";

export function useProduct() {
  const dispatch = useDispatch();

  async function handleGetAllProducts() {
    try {
      dispatch(setLoading(true));
      const response = await getAllProducts();
      dispatch(setProducts(response.products));
      return response.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleCreateProduct(data) {
    try {
      dispatch(setLoading(true));
      const response = await createProduct(data);
      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetProductById(id) {
    try {
      dispatch(setLoading(true));
      const response = await getProductById(id);
      return response.product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetallProductslistUser() {
    try {
      dispatch(setLoading(true));
      const response = await getallProductslistUser();
      dispatch(setProducts(response.products));
      return response.products;
    } catch (error) {
      console.error("Error fetching user products:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetFilteredProducts(filters) {
    try {
      dispatch(setLoading(true));
      const response = await getFilteredProducts(filters);
      dispatch(setProducts(response.products));
      return response.products;
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleAddVariant(productId, variantData) {
    try {
      dispatch(setLoading(true));
      const response = await addProductVariant(productId, variantData);
      return response;
    } catch (error) {
      console.error("Error adding variant:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleUpdateVariant(productId, variantId, variantData) {
    try {
      dispatch(setLoading(true));
      const response = await updateProductVariant(productId, variantId, variantData);
      return response;
    } catch (error) {
      console.error("Error updating variant:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleDeleteVariant(productId, variantId) {
    try {
      dispatch(setLoading(true));
      const response = await deleteProductVariant(productId, variantId);
      return response;
    } catch (error) {
      console.error("Error deleting variant:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleGetAllProducts,
    handleCreateProduct,
    handleGetProductById,
    handleGetallProductslistUser,
    handleGetFilteredProducts,
    handleAddVariant,
    handleUpdateVariant,
    handleDeleteVariant,
  };
}
