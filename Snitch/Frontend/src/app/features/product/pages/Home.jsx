import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hook/useCart';
import { useAuth } from '../../auth/hook/useAuth';

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
      <div className="overflow-hidden rounded-sm border border-neutral-100 bg-white">
        <div className="aspect-[3/4] overflow-hidden bg-white">
          {coverImage ? (
            <img
              src={coverImage}
              alt={product?.title || 'Product'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-50 text-xs text-neutral-400">
              No image
            </div>
          )}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="line-clamp-1 text-xs font-medium text-neutral-900">
          {product?.title || 'Untitled'}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
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
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
      <div className="bg-neutral-900 text-white">
        <p className="py-2 text-center text-[11px] font-medium tracking-wide">
          Acid wash tees are live - discover this week&apos;s new arrivals.
        </p>
      </div>

      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <div className="flex cursor-pointer items-center gap-1 text-sm font-bold tracking-[0.25em] text-black" onClick={() => navigate('/')}>
            <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
            <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <div className="flex items-center gap-2 text-xs sm:gap-4">
                <span className="hidden font-medium text-neutral-600 md:inline">
                  Hi, {user.fullname || user.fullName || user.name || 'User'}
                </span>
                {user.role === 'seller' ? (
                  <button
                    onClick={() => navigate('/Dashboard')}
                    className="rounded bg-neutral-100 px-3 py-1.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-200"
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
                  className="font-medium text-red-600 transition-colors hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium sm:gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-neutral-600 transition-colors hover:text-black"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="rounded border border-black px-3 py-1.5 text-black transition-all hover:bg-black hover:text-white"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => navigate('/cart')}
              className="relative text-neutral-700 transition-colors hover:text-black"
              aria-label="Open cart"
            >
              <CartIcon className="h-[18px] w-[18px]" />
              {cartCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-0.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh]">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
          alt="Featured collection"
          className="h-full w-full object-cover object-top"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/70">
              Spring / Summer 2026
            </p>
            <h1 className="mt-2 text-2xl font-medium leading-snug text-white md:text-3xl">
              Clean essentials built<br className="hidden sm:block" /> for everyday wear.
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
              <span>{totalProducts} curated styles</span>
              <span>{categoryCount || 1} categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Discover
              </p>
              <h2 className="mt-1 text-sm font-semibold text-neutral-900">Browse the collection</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                className="h-10 rounded border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-black"
              >
                <option value="latest">Newest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                New Season
              </p>
              <h2 className="mt-1 text-sm font-semibold text-neutral-900">New Arrivals</h2>
            </div>
            <span className="text-xs text-neutral-400">
              Showing {visibleProducts} of {totalProducts}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] animate-pulse rounded-sm bg-neutral-100" />
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2.5 w-3/4 animate-pulse rounded bg-neutral-200" />
                    <div className="h-2.5 w-1/3 animate-pulse rounded bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleProducts === 0 ? (
            <div className="rounded border border-dashed border-neutral-200 bg-neutral-50 py-16 text-center">
              <p className="text-xs text-neutral-400">No matching products</p>
              <p className="mt-2 text-sm font-medium text-neutral-700">
                Try another search term or switch the category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleOpenProduct(product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {featuredProduct ? (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid overflow-hidden rounded-sm border border-neutral-100 lg:grid-cols-2">
              <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
                {featuredProduct?.images?.[0]?.url ? (
                  <img
                    src={featuredProduct.images[0].url}
                    alt={featuredProduct?.title || 'Featured'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-100" />
                )}
              </div>
              <div className="flex items-center bg-neutral-50 px-6 py-8 md:px-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    Featured Drop
                  </p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-neutral-900 md:text-xl">
                    Built for a cleaner wardrobe and a lighter everyday rotation.
                  </h2>
                  <p className="mt-3 text-xs leading-5 text-neutral-500">
                    Versatile pieces with understated details, easy layering, and a fit-first point of view.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenProduct(featuredProduct._id)}
                    className="mt-5 rounded border border-black px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-black hover:text-white"
                  >
                    View featured product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {bestSellerProducts.length > 0 ? (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Most Wanted
                </p>
                <h2 className="mt-1 text-sm font-semibold text-neutral-900">Best Sellers</h2>
              </div>
              <span className="text-xs text-neutral-400">Top picks by price</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {bestSellerProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleOpenProduct(product._id)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-neutral-100 bg-neutral-50 py-10">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Our Story
          </p>
          <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">
            Snitch is designed around quieter shopping and better everyday staples.
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            A clean, product-led experience so every image and fabric story feels more premium.
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-100 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <p className="text-[11px] tracking-wider text-neutral-400">
            &copy; 2026 Snitch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
