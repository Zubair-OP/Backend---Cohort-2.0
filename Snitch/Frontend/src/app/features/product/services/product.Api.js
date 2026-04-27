import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:3000/api/products',
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
