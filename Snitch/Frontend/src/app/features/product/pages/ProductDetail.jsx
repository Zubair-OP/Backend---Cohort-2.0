import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart';
import { useAuth } from '../../auth/hook/useAuth';
import { ScrollReveal } from '../../../../app/hooks/useScrollReveal';
import SEO from '../../../../app/components/SEO';

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function CartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
  );
}

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
  const { handleGetProductById, handleGetallProductslistUser } = useProduct();
  const { handleAddItem, items, handleGetCart } = useCart();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const allProducts = useSelector((state) => state.product.products);
  const cartCount = items?.length || 0;

  useEffect(() => {
    handleGetallProductslistUser().catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      handleGetCart().catch(() => {});
    }
  }, [user]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
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

  const recommendedProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((p) => p._id !== id).slice(0, 4);
  }, [allProducts, id]);

  const allAttrsSelected = hasAttributes && attrKeys.every((k) => selectedAttributes[k]);
  const variantNotFound = hasAttributes && allAttrsSelected && !selectedVariant;
  const isOutOfStock = activeVariant != null && activeVariant.stock === 0;
  const needsSelection =
    (hasAttributes && !allAttrsSelected) ||
    (noAttrVariants.length > 0 && activeNoAttrVariant == null) ||
    variantNotFound;
  const selectedSummary = hasAttributes
    ? attrKeys
        .map((key) => selectedAttributes[key])
        .filter(Boolean)
        .join(' / ')
    : activeNoAttrVariant
    ? `Option ${selectedNoAttrIdx + 1}`
    : '';

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
    if (addingToCart) return false;
    if (!user) {
      navigate('/login');
      return false;
    }
    if (hasVariants && (!activeVariant || needsSelection)) return false;
    try {
      setAddingToCart(true);
      await handleAddItem(product._id, activeVariant?._id);
      toast.success('Added to cart! Click to view.', {
        onClick: () => navigate('/cart'),
        autoClose: 3000,
      });
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart.');
      return false;
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    const added = await handleAddToCart();
    if (added) {
      navigate('/checkout');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="double-bezel">
              <div className="double-bezel-inner aspect-[4/5] animate-pulse bg-warm-gray" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="double-bezel">
                  <div className="double-bezel-inner aspect-square animate-pulse bg-warm-gray" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-4xl border border-border-light bg-white p-6">
            <div className="h-4 w-24 animate-pulse rounded-full bg-warm-gray" />
            <div className="h-10 w-3/4 animate-pulse rounded-full bg-warm-gray" />
            <div className="h-5 w-32 animate-pulse rounded-full bg-warm-gray" />
            <div className="h-24 animate-pulse rounded-2xl bg-warm-gray" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-500">Error</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-text-primary">Product details unavailable</h2>
          <p className="mt-4 text-base leading-7 text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded-4xl border border-border-light bg-white p-8 text-center">
          <p className="text-sm text-text-muted">Not Found</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-text-primary">Product not found</h2>
        </div>
      </div>
    );
  }

  const mainImage = selectedImage || displayImages[0]?.url || '';
  const amount = displayPrice?.amount;
  const currency = displayPrice?.currency || 'PKR';

  return (
    <div className="min-h-screen bg-cream text-text-primary">
      <SEO
        title={product?.title || 'Product Details'}
        description={product?.description?.slice(0, 160) || 'Shop this premium product from Snitch. Designed for comfort and everyday wear.'}
        image={product?.images?.[0]?.url}
        url={`https://snitch.store/product/${id}`}
        type="product"
        product={product}
      />
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="glass rounded-full px-5 py-3 md:px-8 md:py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex cursor-pointer items-center gap-1 text-sm font-bold tracking-[0.25em] text-black" onClick={() => navigate('/')}>
                <span className="rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs">SN</span>
                <span className="text-xs tracking-[0.3em]">ITCH</span>
              </div>

              <div className="flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-4 text-xs">
                    <span className="hidden font-medium text-text-secondary sm:inline">
                      Hi, {user.fullname || user.fullName || user.name || 'User'}
                    </span>
                    {user.role === 'seller' && (
                      <button
                        onClick={() => navigate('/Dashboard')}
                        className="btn-magnetic rounded-full bg-bg-dark px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium"
                      >
                        Seller Panel
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await handleLogout();
                          toast.success('Logged out successfully.');
                          navigate('/login');
                        } catch {
                          toast.error('Logout failed.');
                        }
                      }}
                      className="font-medium text-text-muted transition-colors duration-600 ease-premium hover:text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <button
                      onClick={() => navigate('/login')}
                      className="text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="btn-magnetic rounded-full border border-black/10 bg-white/50 px-4 py-2 text-black transition-all duration-600 ease-premium hover:bg-bg-dark hover:text-white"
                    >
                      Register
                    </button>
                  </div>
                )}

                <button
                  onClick={() => navigate('/cart')}
                  className="relative text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                >
                  <CartIcon className="h-[18px] w-[18px]" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-0.5 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 transition-transform duration-600 ease-premium group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <section className="space-y-4">
            <ScrollReveal>
              <div className="double-bezel">
                <div className="double-bezel-inner overflow-hidden max-h-[74vh] flex items-center justify-center">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-cream">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product?.title || 'Product image'}
                        className="h-full w-full object-cover transition-all duration-700 ease-premium"
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
              </div>
            </ScrollReveal>

            {displayImages.length > 1 ? (
              <ScrollReveal delay={1}>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-6">
                  {displayImages.slice(0, 6).map((image, index) => {
                    const isActive = image?.url === mainImage;
                    return (
                      <button
                        key={image?.url || index}
                        type="button"
                        onClick={() => setSelectedImage(image?.url || '')}
                        className={`double-bezel transition-all duration-600 ease-premium ${
                          isActive
                            ? '!border-accent ring-2 ring-accent/20'
                            : 'hover:!border-text-secondary'
                        }`}
                      >
                        <div className="double-bezel-inner aspect-square overflow-hidden bg-cream">
                          {image?.url ? (
                            <img
                              src={image.url}
                              alt={`${product?.title || 'Product'} preview ${index + 1}`}
                              className="h-full w-full object-cover"
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
              </ScrollReveal>
            ) : null}
          </section>

          <section className="space-y-5">
            <ScrollReveal>
              <div className="border-b border-border-light pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">New arrival</p>
                <h1 className="mt-2 font-serif text-2xl font-medium leading-tight text-text-primary md:text-3xl">
                  {product?.title || 'Untitled product'}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-lg font-semibold text-text-primary">
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
            </ScrollReveal>

            {hasVariants && (
              <ScrollReveal delay={1}>
                <div className="space-y-5 border-b border-border-light pb-5">
                  {hasAttributes &&
                    attrKeys.map((key) => (
                      <div key={key}>
                        <div className="mb-2.5 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{key}</p>
                          {selectedAttributes[key] && (
                            <p className="text-xs text-accent font-medium">{selectedAttributes[key]}</p>
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
                                className={`btn-magnetic rounded-full border px-4 py-2 text-xs font-medium transition-all duration-600 ease-premium ${
                                  isSelected
                                    ? 'border-bg-dark bg-bg-dark text-white'
                                    : available
                                    ? 'border-border-light bg-white text-text-primary hover:border-bg-dark'
                                    : 'cursor-not-allowed border-border-light bg-warm-gray text-text-muted line-through'
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
                      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">Variant</p>
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
                              className={`btn-magnetic rounded-full border px-4 py-2 text-xs font-medium transition-all duration-600 ease-premium ${
                                isSelected
                                  ? 'border-bg-dark bg-bg-dark text-white'
                                  : 'border-border-light bg-white text-text-primary hover:border-bg-dark'
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
                    <p className="text-xs text-amber-600">This combination is not available.</p>
                  )}

                  {needsSelection && !variantNotFound && (
                    <p className="text-xs text-text-muted">
                      Select your preferred option to continue.
                    </p>
                  )}

                  {activeVariant && !variantNotFound && (
                    <p className={`text-xs font-medium ${isOutOfStock ? 'text-red-500' : 'text-accent'}`}>
                      {isOutOfStock
                        ? 'Out of stock'
                        : `${activeVariant.stock} in stock`}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={2}>
              <div className="space-y-5 border-b border-border-light pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Description</p>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-text-secondary">
                    {product?.description || 'No description available for this product.'}
                  </p>
                </div>

                {selectedSummary && !variantNotFound ? (
                  <div className="rounded-2xl border border-border-light bg-warm-gray/50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      Selected
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary">{selectedSummary}</p>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || needsSelection || addingToCart}
                    className="btn-magnetic w-full rounded-full bg-bg-dark px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingToCart
                      ? 'Adding...'
                      : isOutOfStock
                      ? 'Out of Stock'
                      : needsSelection
                      ? 'Select Option'
                      : 'Add to Cart'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || needsSelection || addingToCart}
                    className="btn-magnetic w-full rounded-full border border-bg-dark px-6 py-3 text-xs font-medium uppercase tracking-wider text-bg-dark transition-all duration-600 ease-premium hover:bg-bg-dark hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:border-text-muted disabled:text-text-muted disabled:opacity-50"
                  >
                    {addingToCart ? 'Adding...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="space-y-3">
                <details className="border-b border-border-light pb-3" open>
                  <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Shipping
                  </summary>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                    Complimentary city-side delivery with shipping rates calculated at checkout.
                  </p>
                </details>
                <details className="border-b border-border-light pb-3">
                  <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Size Chart
                  </summary>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                    Size details can be tailored once your product data includes fit-specific guidance.
                  </p>
                </details>
                <details className="border-b border-border-light pb-3">
                  <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Shipping & Returns
                  </summary>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                    Returns are eligible within 4 days of delivery, subject to store policy.
                  </p>
                </details>
              </div>
            </ScrollReveal>
          </section>
        </div>

        {recommendedProducts.length > 0 && (
          <section className="py-8 md:py-12 border-t border-border-light mt-8">
            <div className="mb-6">
              <ScrollReveal>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Recommended</p>
                <h2 className="mt-2 font-serif text-xl font-medium text-text-primary md:text-2xl">
                  You May Also Like
                </h2>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {recommendedProducts.map((recProduct, i) => {
                const recImage = recProduct.images?.[0]?.url;
                const recAmount = recProduct.price?.amount;
                const recCurrency = recProduct.price?.currency || 'PKR';
                return (
                  <ScrollReveal key={recProduct._id} delay={Math.min(i + 1, 4)}>
                    <article
                      className="group cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${recProduct._id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="double-bezel">
                        <div className="double-bezel-inner overflow-hidden">
                          <div className="aspect-[4/3] overflow-hidden bg-cream">
                            {recImage ? (
                              <img
                                src={recImage}
                                alt={recProduct.title || 'Product'}
                                className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-text-muted">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pt-3">
                        <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-600 ease-premium">
                          {recProduct.title}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-accent">
                          {formatCurrency(recAmount, recCurrency)}
                        </p>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
