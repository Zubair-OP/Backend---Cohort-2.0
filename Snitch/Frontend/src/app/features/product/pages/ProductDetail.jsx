import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart';

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function getAttributeGroups(variants) {
  const groups = {};
  variants.forEach((v) => {
    if (!v.attributes) return;
    Object.entries(v.attributes).forEach(([key, value]) => {
      if (!groups[key]) groups[key] = [];
      if (!groups[key].includes(value)) groups[key].push(value);
    });
  });
  return groups;
}

function findMatchingVariant(variants, selectedAttrs, attrKeys) {
  if (!attrKeys.length || !attrKeys.every((k) => selectedAttrs[k])) return null;
  return variants.find((v) =>
    attrKeys.every((k) => v.attributes?.[k] === selectedAttrs[k])
  ) ?? null;
}

function isValueAvailable(variants, attrKey, value, selectedAttrs) {
  return variants.some((v) => {
    if (v.attributes?.[attrKey] !== value) return false;
    return Object.entries(selectedAttrs).every(
      ([k, sel]) => k === attrKey || !sel || v.attributes?.[k] === sel
    );
  });
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedNoAttrIdx, setSelectedNoAttrIdx] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

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
    if (id) fetchProduct();
  }, [id]);

  const variants = product?.variants || [];

  const attributeGroups = useMemo(() => getAttributeGroups(variants), [variants]);
  const attrKeys = useMemo(() => Object.keys(attributeGroups), [attributeGroups]);
  const hasVariants = variants.length > 0;
  const hasAttributes = attrKeys.length > 0;

  const selectedVariant = useMemo(
    () => findMatchingVariant(variants, selectedAttributes, attrKeys),
    [variants, selectedAttributes, attrKeys]
  );

  const noAttrVariants = hasVariants && !hasAttributes ? variants : [];
  const activeNoAttrVariant = noAttrVariants[selectedNoAttrIdx] ?? null;
  const activeVariant = selectedVariant || activeNoAttrVariant;

  const displayImages = useMemo(() => {
    if (activeVariant?.images?.length) return activeVariant.images;
    return product?.images || [];
  }, [activeVariant, product]);

  const displayPrice =
    activeVariant?.price?.amount != null ? activeVariant.price : product?.price;

  const allAttrsSelected = hasAttributes && attrKeys.every((k) => selectedAttributes[k]);
  const variantNotFound = hasAttributes && allAttrsSelected && !selectedVariant;
  const isOutOfStock = activeVariant != null && activeVariant.stock === 0;
  const needsSelection = hasVariants && !activeVariant;

  useEffect(() => {
    if (displayImages.length) {
      setSelectedImage(displayImages[0].url);
    }
  }, [displayImages]);

  function handleAttributeSelect(key, value) {
    setSelectedAttributes((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  }

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (hasVariants && !activeVariant) return;
    try {
      setAddingToCart(true);
      await handleAddItem(product._id, activeVariant?._id);
      toast.success('Added to cart! Click to view.', {
        onClick: () => navigate('/cart'),
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="aspect-[4/5] animate-pulse rounded bg-bg-secondary" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded bg-bg-secondary" />
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded border border-border-light bg-white p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="h-24 animate-pulse rounded bg-neutral-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-11 animate-pulse rounded bg-neutral-200" />
              <div className="h-11 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-500">Error</p>
          <h2 className="mt-3 text-3xl font-medium text-text-primary">Product details unavailable</h2>
          <p className="mt-4 text-base leading-7 text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded border border-border-light bg-white p-8 text-center">
          <p className="text-sm text-text-muted">Not Found</p>
          <h2 className="mt-3 text-3xl font-medium text-text-primary">Product not found</h2>
        </div>
      </div>
    );
  }

  const mainImage = selectedImage || displayImages[0]?.url || '';
  const amount = displayPrice?.amount;
  const currency = displayPrice?.currency || 'PKR';

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <button type="button" onClick={() => navigate('/')} className="transition-all duration-300 hover:text-black">
            Home
          </button>
          <span>/</span>
          <span>Product</span>
          <span>/</span>
          <span className="text-text-primary">{product?.title || 'Detail'}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <section className="space-y-4">
            <div className="overflow-hidden rounded bg-white border border-border-light">
              <div className="aspect-[4/5] overflow-hidden bg-white">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product?.title || 'Product image'}
                    className="h-full w-full object-contain"
                    decoding="async"
                    fetchpriority="high"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-text-muted">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {displayImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
                {displayImages.slice(0, 5).map((image, index) => {
                  const isActive = image?.url === mainImage;
                  return (
                    <button
                      key={image?.url || index}
                      type="button"
                      onClick={() => setSelectedImage(image?.url || '')}
                      className={`overflow-hidden rounded border transition-all duration-300 ${
                        isActive
                          ? 'border-black'
                          : 'border-border-light hover:border-black'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-white">
                        {image?.url ? (
                          <img
                            src={image.url}
                            alt={`${product?.title || 'Product'} preview ${index + 1}`}
                            className="h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-text-muted">
                            Image
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="border-b border-border-light pb-6">
              <p className="text-sm text-text-muted">New arrival</p>
              <h1 className="mt-2 text-3xl font-medium leading-tight text-text-primary md:text-4xl">
                {product?.title || 'Untitled product'}
              </h1>
              <div className="mt-4 flex items-center gap-3">
                <p className="text-xl font-medium text-text-primary">
                  {formatCurrency(amount, currency)}
                </p>
                {activeVariant?.price?.amount != null &&
                  product?.price?.amount !== activeVariant.price.amount && (
                    <p className="text-sm text-text-muted line-through">
                      {formatCurrency(product.price.amount, product.price.currency)}
                    </p>
                  )}
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-6 border-b border-border-light pb-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">Select options</p>
                  <p className="text-sm text-text-secondary">
                    Choose the right combination before adding to cart.
                  </p>
                </div>

                {hasAttributes &&
                  attrKeys.map((key) => (
                    <div key={key}>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium capitalize text-text-primary">{key}</p>
                        {selectedAttributes[key] && (
                          <p className="text-sm text-text-muted">{selectedAttributes[key]}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {attributeGroups[key].map((value) => {
                          const isSelected = selectedAttributes[key] === value;
                          const available = isValueAvailable(
                            variants,
                            key,
                            value,
                            selectedAttributes
                          );
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleAttributeSelect(key, value)}
                              disabled={!available}
                              className={`rounded border px-4 py-2 text-sm transition-all duration-300 ${
                                isSelected
                                  ? 'border-black bg-black text-white'
                                  : available
                                  ? 'border-border-default bg-white text-text-primary hover:border-black'
                                  : 'cursor-not-allowed border-border-light bg-bg-secondary text-text-muted line-through'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                {noAttrVariants.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-text-primary">Variant</p>
                    <div className="flex flex-wrap gap-2">
                      {noAttrVariants.map((v, idx) => {
                        const isSelected = selectedNoAttrIdx === idx;
                        return (
                          <button
                            key={v._id || idx}
                            type="button"
                            onClick={() =>
                              setSelectedNoAttrIdx(isSelected ? -1 : idx)
                            }
                            className={`rounded border px-4 py-2 text-sm transition-all duration-300 ${
                              isSelected
                                ? 'border-black bg-black text-white'
                                : 'border-border-default bg-white text-text-primary hover:border-black'
                            }`}
                          >
                            Option {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {variantNotFound && (
                  <p className="text-sm text-amber-600">This combination is not available.</p>
                )}

                {activeVariant && !variantNotFound && (
                  <p className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-text-secondary'}`}>
                    {isOutOfStock
                      ? 'Out of stock'
                      : `${activeVariant.stock} in stock`}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-6 border-b border-border-light pb-6">
              <div>
                <p className="text-sm font-medium text-text-primary">Description</p>
                <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
                  {product?.description || 'No description available for this product.'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || needsSelection || addingToCart}
                  className="w-full rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingToCart
                    ? 'Adding...'
                    : isOutOfStock
                    ? 'Out of Stock'
                    : needsSelection
                    ? 'Select an Option'
                    : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock || needsSelection}
                  className="w-full rounded border border-black px-8 py-3 text-sm font-normal text-black transition-all duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <details className="border-b border-border-light pb-4" open>
                <summary className="cursor-pointer list-none text-sm font-medium text-text-primary">
                  Shipping
                </summary>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Complimentary city-side delivery with shipping rates calculated at checkout.
                </p>
              </details>
              <details className="border-b border-border-light pb-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-text-primary">
                  Size Chart
                </summary>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Size details can be tailored once your product data includes fit-specific guidance.
                </p>
              </details>
              <details className="border-b border-border-light pb-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-text-primary">
                  Shipping & Returns
                </summary>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Returns are eligible within 4 days of delivery, subject to store policy.
                </p>
              </details>
            </div>
          </section>
        </div>

        <section className="py-12 md:py-16">
          <div className="mb-8">
            <p className="text-sm text-text-muted">Recommended</p>
            <h2 className="mt-2 text-2xl font-medium text-text-primary md:text-3xl">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(product?.images || []).slice(0, 4).map((image, index) => (
              <article key={image?.url || index} className="group">
                <div className="overflow-hidden rounded bg-white border border-border-light">
                  <div className="aspect-[4/5] overflow-hidden bg-white">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={`${product?.title || 'Product'} recommendation ${index + 1}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-text-muted">
                        Image
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="text-base font-normal text-text-primary">
                    {product?.title || 'Product'}
                  </h3>
                  <p className="mt-1 text-base font-medium text-text-primary">
                    {formatCurrency(amount, currency)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
