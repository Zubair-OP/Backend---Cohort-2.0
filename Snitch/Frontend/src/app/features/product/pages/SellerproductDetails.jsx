import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

const SellerproductDetails = () => {
    const { Productid } = useParams();
    const { getProductById } = useProduct();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(Productid);
                setProduct(data);
            }
            catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [Productid]);

    console.log(product)
  return (
    <div>
      <h1>SellerProductDetails is here</h1>
    </div>
  )
}

export default SellerproductDetails
