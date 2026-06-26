import axios from 'axios';
import { API_BASE_URL } from '../../../config/apiBaseUrl.js';

const Api = axios.create({
  baseURL: `${API_BASE_URL}/api/products`,
  withCredentials: true,
});


export async function getAllProducts() {
  try {
    const response = await Api.get('/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id) {
  try {
    const response = await Api.get(`/details/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const response = await Api.post('/add', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  } 
}

export async function getallProductslistUser() {
  try {
    const response = await Api.get('/user-list');
    return response.data;
  }
  catch (error) {
    console.error('Error fetching user products:', error);
    throw error;
  }
}

export async function getFilteredProducts(params = {}) {
  try {
    const response = await Api.get('/filter', { params });
    return response.data;
  } catch (error) {
    console.error('Error filtering products:', error);
    throw error;
  }
}

export async function addProductVariant(productId, newProductVariant) {
  const formData = new FormData();

  (newProductVariant.images || []).forEach((image) => {
    formData.append('images', image.file);
  });

  formData.append('stock', newProductVariant.stock);
  formData.append('priceAmount', newProductVariant.price);
  formData.append('priceCurrency', newProductVariant.currency || 'PKR');
  formData.append('attributes', JSON.stringify(newProductVariant.attributes));

  const response = await Api.post(`/variants/${productId}`, formData);
  return response.data;
}

export async function updateProductVariant(productId, variantId, data) {
  const response = await Api.put(`/variants/${productId}/${variantId}`, {
    stock: data.stock,
    priceAmount: data.price,
    priceCurrency: data.currency || 'PKR',
    attributes: JSON.stringify(data.attributes),
  });
  return response.data;
}

export async function deleteProductVariant(productId, variantId) {
  const response = await Api.delete(`/variants/${productId}/${variantId}`);
  return response.data;
}
