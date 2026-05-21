import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hook/useCart';

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
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
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

function FooterList({ title, items }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="text-xs text-neutral-500">{item}</p>
        ))}
      </div>
    </div>
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
  const { handleGetallProductslistUser } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const navigate = useNavigate();
  const { items } = useCart();
  const cartCount = items.length;

  const handleOpenProduct = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await handleGetallProductslistUser();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load products.');
      }
    };
    loadProducts();
  }, []);

  const totalProducts = products?.length || 0;
  const featuredProduct = products?.[0];

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">

      {/* Announcement bar */}
      <div className="bg-neutral-900 text-white">
        <p className="py-2 text-center text-[11px] font-medium tracking-wide">
          Acid wash tees are live — discover this week&apos;s new arrivals.
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          <div className="flex items-center gap-1 text-sm font-bold tracking-[0.25em] text-black">
            <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
            <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="relative text-neutral-700 transition-colors hover:text-black"
          >
            <CartIcon className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-0.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-[80vh]">
        {featuredProduct?.images?.[0]?.url ? (
          <img
            src={featuredProduct.images[0].url}
            alt={featuredProduct?.title || 'Featured collection'}
            className="h-full w-full object-cover"
            fetchpriority="high"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/70">
              Spring / Summer 2026
            </p>
            <h1 className="mt-2 text-2xl font-medium leading-snug text-white md:text-3xl">
              Clean essentials built<br className="hidden sm:block" /> for everyday wear.
            </h1>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                New Season
              </p>
              <h2 className="mt-1 text-sm font-semibold text-neutral-900">New Arrivals</h2>
            </div>
            {totalProducts > 0 && (
              <span className="text-xs text-neutral-400">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
              </span>
            )}
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
          ) : totalProducts === 0 ? (
            <div className="rounded border border-dashed border-neutral-200 bg-neutral-50 py-16 text-center">
              <p className="text-xs text-neutral-400">No products yet</p>
              <p className="mt-2 text-sm font-medium text-neutral-700">
                Products will appear here once added by the seller.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.slice(0, 8).map((product) => (
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

      {/* Featured Banner */}
      {featuredProduct && (
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
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {totalProducts > 0 && (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Most Wanted
                </p>
                <h2 className="mt-1 text-sm font-semibold text-neutral-900">Best Sellers</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleOpenProduct(product._id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand strip */}
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

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 text-sm font-bold tracking-[0.25em] text-black">
                <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
                <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                A clean, product-first store for modern everyday menswear.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Visa', 'Mastercard', 'COD'].map((method) => (
                  <span key={method} className="rounded border border-neutral-200 px-2 py-1 text-[10px] text-neutral-500">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <FooterList title="Shop" items={['Shirts', 'Tees', 'Pants', 'Polos']} />
            <FooterList
              title="Support"
              items={['Contact Us', 'Returns', 'Shipping Info', 'Size Guide']}
            />
            <FooterList
              title="Company"
              items={['About Us', 'Privacy Policy', 'Terms & Conditions']}
            />
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <p className="text-[11px] text-neutral-400">
              &copy; 2026 Snitch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
