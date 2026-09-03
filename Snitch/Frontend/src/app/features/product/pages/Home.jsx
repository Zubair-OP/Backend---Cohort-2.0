import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hook/useCart';
import { useAuth } from '../../auth/hook/useAuth';
import { ScrollReveal } from '../../../../app/hooks/useScrollReveal';
import SEO from '../../../../app/components/SEO';

const CATEGORY_OPTIONS = ['all', 'shirts', 'pants', 'caps', 'hoodies', 'shoes', 'Kameez Shalwar'];

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function ProductCard({ product, onClick }) {
  const coverImage = product?.images?.[0]?.url;
  const amount = product?.price?.amount;
  const currency = product?.price?.currency || 'PKR';

  return (
    <article onClick={onClick} className="group cursor-pointer">
      <div className="double-bezel">
        <div className="double-bezel-inner overflow-hidden">
          <div className="aspect-[3/4] overflow-hidden bg-cream">
            {coverImage ? (
              <img
                src={coverImage}
                alt={product?.title || 'Product'}
                className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-warm-gray text-xs text-text-muted">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-1 text-sm font-medium text-text-primary">
          {product?.title || 'Untitled'}
        </h3>
        <p className="mt-1 text-sm text-accent font-semibold">
          {formatCurrency(amount, currency)}
        </p>
      </div>
    </article>
  );
}

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

const Home = () => {
  const { handleGetFilteredProducts } = useProduct();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const navigate = useNavigate();
  const { items } = useCart();
  const cartCount = items.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const handleOpenProduct = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await handleGetFilteredProducts({
          category: selectedCategory,
          search: debouncedSearchQuery,
          sortBy,
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load products.');
      }
    };

    loadProducts();
  }, [selectedCategory, debouncedSearchQuery, sortBy]);

  const latestProducts = useMemo(
    () => [...(products || [])].slice(0, 8),
    [products],
  );

  const bestSellerProducts = useMemo(
    () =>
      [...(products || [])]
        .sort((a, b) => (Number(b?.price?.amount) || 0) - (Number(a?.price?.amount) || 0))
        .slice(0, 4),
    [products],
  );

  const totalProducts = products?.length || 0;
  const visibleProducts = products?.length || 0;
  const featuredProduct = products?.[0];
  const categoryCount = CATEGORY_OPTIONS.length - 1;

  return (
    <div className="min-h-screen bg-cream font-sans text-text-primary antialiased noise-overlay">
      <SEO
        title="Snitch | Premium Everyday Clothing"
        description="Shop curated essentials — shirts, pants, hoodies, caps & Kameez Shalwar. Designed for comfort, built for everyday wear. Free delivery across Pakistan."
        url="https://snitch.store"
      />

      {/* Top Banner */}
      <div className="bg-bg-dark text-white">
        <p className="py-2.5 text-center text-[11px] font-medium tracking-[0.2em] uppercase">
          Acid wash tees are live — discover this week&apos;s new arrivals.
        </p>
      </div>

      {/* Floating Glass Navbar */}
      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <nav className="glass rounded-full px-5 py-3 md:px-8 md:py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex cursor-pointer items-center gap-1 text-sm font-bold tracking-[0.25em] text-black" onClick={() => navigate('/')}>
                <span className="rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs">SN</span>
                <span className="text-xs tracking-[0.3em]">ITCH</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                {user ? (
                  <div className="flex items-center gap-2 text-xs sm:gap-4">
                    <span className="hidden font-medium text-text-secondary md:inline">
                      Hi, {user.fullname || user.fullName || user.name || 'User'}
                    </span>
                    {user.role === 'seller' ? (
                      <button
                        onClick={() => navigate('/Dashboard')}
                        className="btn-magnetic rounded-full bg-bg-dark px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black"
                      >
                        Seller Panel
                      </button>
                    ) : null}
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
                  <div className="flex items-center gap-2 text-xs font-medium sm:gap-4">
                    <button
                      onClick={() => navigate('/login')}
                      className="text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="btn-magnetic rounded-full border border-black/10 bg-white/50 px-4 py-2 text-black transition-all duration-600 ease-premium hover:bg-bg-dark hover:text-white hover:border-bg-dark"
                    >
                      Register
                    </button>
                  </div>
                )}

                <button
                  onClick={() => navigate('/cart')}
                  className="relative text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                  aria-label="Open cart"
                >
                  <CartIcon className="h-[18px] w-[18px]" />
                  {cartCount > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-0.5 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-4 mt-4 overflow-hidden rounded-4xl md:mx-8 md:mt-6" style={{ minHeight: '70vh' }}>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
          alt="Featured collection"
          className="absolute inset-0 h-full w-full object-cover object-top"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="relative flex min-h-[70vh] flex-col justify-end px-6 pb-10 pt-20 md:px-12 md:pb-14">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
              Spring / Summer 2026
            </p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-medium leading-[1.1] text-white md:text-6xl lg:text-7xl">
              Clean essentials built for everyday wear.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="mt-6 flex flex-wrap gap-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
              <span>{totalProducts} curated styles</span>
              <span>{categoryCount || 1} categories</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <ScrollReveal>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                  Discover
                </p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-text-primary md:text-3xl">
                  Browse the collection
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="h-11 rounded-full border border-border-light bg-white px-5 text-sm text-text-primary outline-none placeholder:text-text-muted transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 rounded-full border border-border-light bg-white px-5 text-sm text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent"
                >
                  <option value="latest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={2}>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`btn-magnetic rounded-full border px-4 py-2 text-xs font-medium transition-all duration-600 ease-premium ${
                      isSelected
                        ? 'border-bg-dark bg-bg-dark text-white'
                        : 'border-border-light bg-white text-text-secondary hover:border-bg-dark hover:text-black'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals — Asymmetric Bento Grid */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <ScrollReveal>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                  New Season
                </p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-text-primary md:text-3xl">
                  New Arrivals
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <span className="text-xs text-text-muted">
                Showing {visibleProducts} of {totalProducts}
              </span>
            </ScrollReveal>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="double-bezel">
                    <div className="double-bezel-inner aspect-[3/4] animate-pulse bg-warm-gray" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-warm-gray" />
                    <div className="h-3 w-1/3 animate-pulse rounded-full bg-warm-gray" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleProducts === 0 ? (
            <div className="rounded-4xl border border-dashed border-border-light bg-warm-gray/50 py-20 text-center">
              <p className="text-sm text-text-muted">No matching products</p>
              <p className="mt-2 text-base font-medium text-text-secondary">
                Try another search term or switch the category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {latestProducts.map((product, i) => (
                <ScrollReveal key={product._id} delay={Math.min(i + 1, 4)}>
                  <ProductCard
                    product={product}
                    onClick={() => handleOpenProduct(product._id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Drop — Editorial Split */}
      {featuredProduct ? (
        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <ScrollReveal>
              <div className="double-bezel">
                <div className="double-bezel-inner grid overflow-hidden lg:grid-cols-2">
                  <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
                    {featuredProduct?.images?.[0]?.url ? (
                      <img
                        src={featuredProduct.images[0].url}
                        alt={featuredProduct?.title || 'Featured'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-full w-full bg-warm-gray" />
                    )}
                  </div>
                  <div className="flex items-center bg-cream px-8 py-10 md:px-12">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                        Featured Drop
                      </p>
                      <h2 className="mt-3 font-serif text-xl font-medium leading-snug text-text-primary md:text-2xl">
                        Built for a cleaner wardrobe and a lighter everyday rotation.
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                        Versatile pieces with understated details, easy layering, and a fit-first point of view.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenProduct(featuredProduct._id)}
                        className="btn-magnetic mt-6 inline-flex items-center gap-3 rounded-full bg-bg-dark px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
                      >
                        View featured product
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px]">
                          ↗
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* Best Sellers */}
      {bestSellerProducts.length > 0 ? (
        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mb-8 flex items-end justify-between">
              <ScrollReveal>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                    Most Wanted
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-medium text-text-primary md:text-3xl">
                    Best Sellers
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <span className="text-xs text-text-muted">Top picks by price</span>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {bestSellerProducts.map((product, i) => (
                <ScrollReveal key={product._id} delay={Math.min(i + 1, 4)}>
                  <ProductCard
                    product={product}
                    onClick={() => handleOpenProduct(product._id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <ScrollReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
              Our Story
            </p>
            <p className="mt-4 font-serif text-xl font-medium leading-relaxed text-text-primary md:text-2xl">
              Snitch is designed around quieter shopping and better everyday staples.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              A clean, product-led experience so every image and fabric story feels more premium.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light bg-cream py-8">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <p className="text-[11px] tracking-[0.2em] text-text-muted uppercase">
            &copy; 2026 Snitch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
