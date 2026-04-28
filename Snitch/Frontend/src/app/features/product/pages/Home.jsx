import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';

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
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[1.8rem] border border-stone-200/80 bg-[#fbfaf7] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(46,32,18,0.08)]"
    >
      <div className="overflow-hidden bg-[#efe7dc] p-3">
        <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#f7f3eb]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product?.title || 'Product image'}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-500">
            No image available
          </div>
        )}
        </div>
      </div>

      <div className="space-y-3 px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-400">New Arrival</p>
            <h3
              className="mt-2 text-[1.8rem] leading-none text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              {product?.title || 'Untitled product'}
            </h3>
          </div>
          <p className="pt-1 text-[12px] font-medium uppercase tracking-[0.12em] text-stone-700">
            {formatCurrency(amount, currency)}
          </p>
        </div>

        <p className="line-clamp-2 text-[14px] leading-6 text-stone-500">
          {product?.description || 'No description added for this product yet.'}
        </p>

        <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-[10px] uppercase tracking-[0.22em] text-stone-400">
          <span>{product?.images?.length || 0} Images</span>
          <span>View Product</span>
        </div>
      </div>
    </article>
  );
}

const Home = () => {
  const { handleGetallProductslistUser } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const navigate = useNavigate();

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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#f7f4ee] text-stone-900"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
      <nav className="border-b border-stone-200/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p
              className="text-[1.6rem] tracking-[0.34em] text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SNITCH
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-400">
              Curated store
            </p>
          </div>

          <div className="hidden items-center gap-8 text-[14px] text-stone-500 md:flex">
            <span>Home</span>
            <span>Collection</span>
            <span>Essentials</span>
            <span>Journal</span>
          </div>

          <button className="border border-stone-300 bg-[#fbfaf7] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-700 transition hover:bg-white">
            Cart
          </button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-16">
        <div className="border border-stone-200/80 bg-[#fbfaf7] p-8 sm:p-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">Spring editorial</p>
          <h1
            className="mt-5 max-w-3xl text-[3.2rem] leading-[0.95] text-stone-800 sm:text-[4.7rem]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            Light, refined pieces for a quieter wardrobe.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-stone-500">
            Discover a minimal storefront shaped with soft neutrals, premium spacing, and a calmer shopping experience.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="border border-stone-200 bg-[#f3ede3] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Products</p>
              <p className="mt-2 text-xl font-medium text-stone-800">{totalProducts}</p>
            </div>
            <div className="border border-stone-200 bg-[#fbfaf7] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Featured</p>
              <p className="mt-2 text-[13px] font-medium text-stone-700">
                {featuredProduct?.title || 'Waiting for first listing'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-stone-200/80 bg-[#efe7dc] p-8 sm:p-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">Store note</p>
            <h2
              className="mt-5 text-[2.4rem] leading-none text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              Premium, light, and product-first.
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-stone-600">
              The palette is deliberately soft and airy so the products feel elevated without a noisy interface.
            </p>
          </div>
          <div className="mt-10 grid gap-4">
            <div className="border border-stone-200/80 bg-[#fbfaf7] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Material direction</p>
              <p className="mt-2 text-[14px] text-stone-700">Warm ivory, beige surfaces, charcoal typography.</p>
            </div>
            <div className="border border-stone-200/80 bg-[#fbfaf7] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Experience</p>
              <p className="mt-2 text-[14px] text-stone-700">Calm browsing, cleaner cards, and a more premium product focus.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">Product Collection</p>
            <h2
              className="mt-3 text-[2.6rem] leading-none text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              All listed products
            </h2>
          </div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-stone-400">
            {totalProducts} item{totalProducts === 1 ? '' : 's'}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.8rem] border border-stone-200 bg-[#fbfaf7]"
              >
                <div className="p-3">
                  <div className="aspect-[4/5] animate-pulse rounded-[1.25rem] bg-[#ede6dc]" />
                </div>
                <div className="space-y-3 px-5 pb-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
                  <div className="h-8 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-12 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : totalProducts === 0 ? (
          <div className="border border-dashed border-stone-300 bg-[#fbfaf7] px-6 py-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">No Products Yet</p>
            <h3
              className="mt-4 text-[2.4rem] leading-none text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              Products listed by the seller will appear here
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-stone-500">
              Once a seller creates products, this homepage will automatically show them in this collection section.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => handleOpenProduct(product._id)}
              />
            ))}
          </div>
        )}
      </section>
      </div>
    </>
  );
};

export default Home;
