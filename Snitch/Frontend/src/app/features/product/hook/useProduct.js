import {
  getAllProducts,
  createProduct,
  getProductById,
  getallProductslistUser,
} from "../services/product.Api";

import {
  setLoading,
  setProducts,
} from "../../product/state/product.slice";

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

  return {
    handleGetAllProducts,
    handleCreateProduct,
    handleGetProductById,
    handleGetallProductslistUser,
  };
}
