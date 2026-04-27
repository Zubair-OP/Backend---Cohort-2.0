import { useProduct } from '../hooks/useProduct'
import { useEffect, useState } from 'react'


const ProductDetails = () => {
  const { handleGetProductById } = useProduct();
  const [product, setproduct] = useState(null);

   async function fetchProductDetails() {
    try {
      const productData = await handleGetProductById(id);
      setproduct(productData);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  console.log(product)
  return (
    <div>
      
    </div>
  )
}

export default ProductDetails
