import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function ProductCard({ product }) {
  const coverImage = product?.images?.[0]?.url;
  const amount = product?.price?.amount;
  const currency = product?.price?.currency || 'PKR';

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_20px_60px_rgba(236,72,153,0.12)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_22px_62px_rgba(249,115,22,0.14)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-200">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product?.title || 'Product image'}
            className="h-full w-full object-cover transition duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-500">
            No image available
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-gradient-to-r from-orange-100 to-rose-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500">
            Trending
          </span>
          <p className="text-base font-semibold text-stone-900">
            {formatCurrency(amount, currency)}
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-stone-900">
            {product?.title || 'Untitled product'}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-stone-600">
            {product?.description || 'No description added for this product yet.'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-rose-100 pt-3 text-[11px] uppercase tracking-[0.16em] text-stone-400">
          <span>{product?.images?.length || 0} Images</span>
          <span>Fresh Drop</span>
        </div>
      </div>
    </article>
  );
}

const Home = () => {
  const { handleGetallProductslistUser } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen text-stone-900"
        style={{ fontFamily: "'Outfit', sans-serif", backgroundColor: '#fff7ed' }}
      >
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.28),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.24),_transparent_28%),linear-gradient(180deg,_#fff7ed_0%,_#fff1f2_42%,_#fffdf8_100%)]" />

      <nav className="border-b border-orange-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div>
            <p className="text-[2rem] font-extrabold tracking-[0.24em] text-stone-900">SNITCH</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-orange-400">
              Sample Navbar
            </p>
          </div>

          <div className="hidden items-center gap-8 text-[15px] font-medium text-stone-600 md:flex">
            <span>Home</span>
            <span>Collection</span>
            <span>New In</span>
            <span>Contact</span>
          </div>

          <button className="rounded-full border border-orange-200 bg-white px-4 py-2 text-[14px] font-medium text-stone-700 transition hover:border-orange-300 hover:bg-orange-50">
            Cart
          </button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#18181b_0%,#7c2d12_45%,#db2777_100%)] px-7 py-10 text-white shadow-[0_28px_80px_rgba(217,119,6,0.22)] sm:px-10">
          <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-16 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-orange-100">Snitch Store</p>
          <h1 className="mt-4 max-w-xl text-[2.8rem] font-semibold leading-[1.02] sm:text-[3.4rem]">
            Discover every product your seller has listed in one clean storefront.
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-7 text-orange-50/90 sm:text-[15px]">
            A minimal homepage layout with a simple shopping feel, built to highlight your product listings clearly.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-100">Products</p>
              <p className="mt-2 text-xl font-semibold text-white">{totalProducts}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-100">Featured</p>
              <p className="mt-2 text-[13px] font-medium text-white">
                {featuredProduct?.title || 'Waiting for first listing'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-rose-100 bg-white/85 p-6 shadow-[0_18px_50px_rgba(244,114,182,0.12)] backdrop-blur sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose-400">Store Note</p>
          <h2 className="mt-3 text-[1.8rem] font-semibold text-stone-900">Fresh, simple, product-first.</h2>
          <p className="mt-4 text-[14px] leading-7 text-stone-600">
            This sample homepage keeps the navigation lightweight and puts the spotlight on the products added by the seller.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-rose-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-orange-400">Layout</p>
              <p className="mt-2 text-[14px] text-stone-700">Simple navbar, hero section, and product grid.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-fuchsia-50 to-amber-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-pink-400">Styling</p>
              <p className="mt-2 text-[14px] text-stone-700">Tailwind-based, brighter colors, softer text, and bolder cards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-orange-400">Product Collection</p>
            <h2 className="mt-2 text-[2rem] font-semibold text-stone-900">All listed products</h2>
          </div>
          <p className="text-[13px] text-stone-500">{totalProducts} item{totalProducts === 1 ? '' : 's'}</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-sm"
              >
                <div className="aspect-[4/5] animate-pulse bg-gradient-to-br from-orange-100 via-rose-100 to-fuchsia-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-orange-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-rose-100" />
                  <div className="h-14 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : totalProducts === 0 ? (
          <div className="rounded-[2.2rem] border border-dashed border-orange-200 bg-white/85 px-6 py-16 text-center shadow-[0_20px_60px_rgba(251,146,60,0.08)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-orange-400">No Products Yet</p>
            <h3 className="mt-3 text-[1.8rem] font-semibold text-stone-900">
              Products listed by the seller will appear here
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-stone-600">
              Once a seller creates products, this homepage will automatically show them in this collection section.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      </div>
    </>
  );
};

export default Home;
