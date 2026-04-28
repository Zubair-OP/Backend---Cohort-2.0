import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const ProductDetail = () => {
  const { id } = useParams();
  const { handleGetProductById } = useProduct();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const productData = await handleGetProductById(id);
        setProduct(productData);
        setSelectedImage(productData?.images?.[0]?.url || '');
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || 'Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-stone-200" />
          <div className="space-y-4 rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-6 w-40 animate-pulse rounded bg-stone-200" />
            <div className="h-24 animate-pulse rounded bg-stone-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-12 animate-pulse rounded-full bg-stone-200" />
              <div className="h-12 animate-pulse rounded-full bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-400">Error</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">Product details unavailable</h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-500">Not Found</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">Product not found</h2>
        </div>
      </div>
    );
  }

  const images = product?.images || [];
  const mainImage = selectedImage || images?.[0]?.url || '';
  const amount = product?.price?.amount;
  const currency = product?.price?.currency || 'PKR';

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#f7f4ee] px-4 py-6 text-stone-900 sm:px-6 lg:px-8 lg:py-5"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col">
          <div className="mb-5 flex items-center justify-between border-b border-stone-200/80 pb-3 lg:mb-4 lg:pb-2">
            <div>
              <p
                className="text-[1.25rem] tracking-[0.28em] text-stone-700 lg:text-[1.2rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                SNITCH
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-stone-400">Product view</p>
            </div>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-stone-400 sm:block">
              Quiet luxury edit
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <section className="grid gap-3 lg:grid-cols-[74px_minmax(0,1fr)]">
              {images.length > 1 ? (
                <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
                  {images.map((image, index) => {
                    const isActive = image?.url === mainImage;

                    return (
                      <button
                        key={image?.url || index}
                        type="button"
                        onClick={() => setSelectedImage(image?.url || '')}
                        className={`shrink-0 overflow-hidden border transition ${
                          isActive
                            ? 'border-stone-700 bg-white'
                            : 'border-stone-200 bg-[#f1ece4] hover:border-stone-400'
                        } rounded-[1.2rem]`}
                      >
                        <div className="h-20 w-[4.5rem] bg-[#ede6dc] sm:h-24 sm:w-[5rem] lg:h-[5.4rem] lg:w-[4.5rem]">
                          {image?.url ? (
                            <img
                              src={image.url}
                              alt={`${product?.title || 'Product'} preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-stone-400">
                              Image
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className={`order-1 ${images.length > 1 ? 'lg:order-2' : ''}`}>
                <div className="overflow-hidden rounded-[1.8rem] bg-[#efe6d8] p-3 sm:p-4 lg:p-4">
                  <div className="flex min-h-[280px] max-h-[56vh] items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f4ede3] lg:min-h-[520px] lg:max-h-[62vh]">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product?.title || 'Product image'}
                        className="max-h-[56vh] w-full object-contain lg:max-h-[62vh]"
                      />
                    ) : (
                      <div className="flex h-[280px] w-full items-center justify-center text-sm text-stone-500 lg:h-[520px]">
                        No image available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-l-0 border-stone-200/80 pt-0 lg:border-l lg:pl-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">The Detail</p>
              <h1
                className="mt-4 max-w-md text-[2.45rem] leading-[0.9] text-stone-800 sm:text-[3.25rem] lg:text-[3.45rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                {product?.title || 'Untitled product'}
              </h1>

              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-700">
                {formatCurrency(amount, currency)}
              </p>

              <div className="mt-7 border-t border-stone-200/80 pt-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-300">The Details</p>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-stone-600">
                  {product?.description || 'No description available for this product.'}
                </p>
              </div>

              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  className="w-full border border-stone-800 bg-stone-800 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-stone-700"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="w-full border border-stone-200 bg-transparent px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-700 transition hover:bg-white/70"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-stone-200/80 pt-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-300">Shipping</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-stone-600">Complimentary city-side delivery</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-300">Returns</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-stone-600">Eligible within 4 days of delivery</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-300">Currency</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-stone-600">{currency}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-300">Gallery</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-stone-600">{images.length} image{images.length === 1 ? '' : 's'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
