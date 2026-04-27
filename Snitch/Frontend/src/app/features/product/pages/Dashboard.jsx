import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

const accentColors = {
  background: '#fbf9f6',
  surface: '#ffffff',
  line: '#e4e2df',
  muted: '#7A6E63',
  text: '#1b1c1a',
  accent: '#C9A96E',
  subtle: '#B5ADA3',
};

const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    : 'Recently added';

function ProductCard({ product }) {
  const coverImage = product?.images?.[0]?.url;
  const amount = product?.price?.amount;
  const currency = product?.price?.currency || 'PKR';

  return (
    <article
      className="overflow-hidden border bg-white"
      style={{ borderColor: accentColors.line }}
    >
      <div
        className="aspect-[4/3.6] w-full"
        style={{ backgroundColor: '#f3efe9' }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.18em]"
            style={{ color: accentColors.subtle }}
          >
            No image
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: accentColors.subtle }}
            >
              Listed {formatDate(product.createdAt)}
            </p>
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: accentColors.accent }}
            >
              {product?.images?.length || 0} image{product?.images?.length === 1 ? '' : 's'}
            </span>
          </div>

          <h3
            className="text-[1.35rem] leading-[1.08]"
            style={{ fontFamily: "'Fraunces', serif", color: accentColors.text }}
          >
            {product.title}
          </h3>
          <p className="line-clamp-3 text-[13px] leading-6" style={{ color: accentColors.muted }}>
            {product.description}
          </p>
        </div>

        <div
          className="flex items-center justify-between border-t pt-3"
          style={{ borderColor: accentColors.line }}
        >
          <p className="text-[13px] font-semibold" style={{ color: accentColors.text }}>
            {formatCurrency(amount, currency)}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
            Product
          </p>
        </div>
      </div>
    </article>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        await handleGetAllProducts();
      } catch (error) {
        if (isMounted) {
          toast.error(error?.response?.data?.message || 'Unable to load your products.');
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const sellerName = user?.fullname || user?.fullName || user?.name || 'Seller';
  const totalProducts = products?.length || 0;
  const totalValue = (products || []).reduce(
    (sum, product) => sum + (Number(product?.price?.amount) || 0),
    0,
  );
  const primaryCurrency = products?.[0]?.price?.currency || 'PKR';

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Manrope:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen px-6 py-8 sm:px-10 lg:px-16"
        style={{ backgroundColor: accentColors.background, fontFamily: "'Manrope', sans-serif" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div
              className="border px-5 py-6 sm:px-7"
              style={{ borderColor: accentColors.line, backgroundColor: accentColors.surface }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: accentColors.accent }}
              >
                Seller Dashboard
              </p>
              <h1
                className="mt-2 text-[2rem] leading-[1.02] sm:text-[2.45rem]"
                style={{ fontFamily: "'Fraunces', serif", color: accentColors.text }}
              >
                {sellerName}&apos;s listed products
              </h1>
              <p className="mt-3 max-w-xl text-[13px] leading-6" style={{ color: accentColors.muted }}>
                A quiet view of everything you have published so far, with enough breathing room to scan the catalog quickly.
              </p>
            </div>

            <div
              className="flex flex-col justify-between gap-5 border px-5 py-6 sm:px-7"
              style={{ borderColor: accentColors.line, backgroundColor: accentColors.surface }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
                    Total Products
                  </p>
                  <p className="mt-2 text-[1.7rem]" style={{ color: accentColors.text }}>
                    {totalProducts}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
                    Catalog Value
                  </p>
                  <p className="mt-2 text-[1.7rem]" style={{ color: accentColors.text }}>
                    {formatCurrency(totalValue, primaryCurrency)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/create-product')}
                className="w-full py-3 text-[11px] uppercase tracking-[0.24em] font-semibold transition-all duration-300"
                style={{ backgroundColor: accentColors.text, color: accentColors.background }}
              >
                Add New Product
              </button>
            </div>
          </section>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden border bg-white"
                  style={{ borderColor: accentColors.line }}
                >
                  <div className="aspect-[4/3.6] animate-pulse" style={{ backgroundColor: '#efe9df' }} />
                  <div className="space-y-3 px-4 py-4">
                    <div className="h-3 w-24 animate-pulse" style={{ backgroundColor: '#efe9df' }} />
                    <div className="h-6 w-3/4 animate-pulse" style={{ backgroundColor: '#efe9df' }} />
                    <div className="h-16 animate-pulse" style={{ backgroundColor: '#f5f1ea' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : totalProducts === 0 ? (
            <section
              className="border px-6 py-12 text-center sm:px-8"
              style={{ borderColor: accentColors.line, backgroundColor: accentColors.surface }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: accentColors.accent }}
              >
                Nothing Listed Yet
              </p>
              <h2
                className="mt-3 text-[2rem]"
                style={{ fontFamily: "'Fraunces', serif", color: accentColors.text }}
              >
                Your storefront is ready for its first product
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7" style={{ color: accentColors.muted }}>
                Start with one polished listing and it will appear here automatically once published.
              </p>
              <button
                type="button"
                onClick={() => navigate('/create-product')}
                className="mt-8 px-8 py-3 text-[11px] uppercase tracking-[0.24em] font-semibold transition-all duration-300"
                style={{ backgroundColor: accentColors.text, color: accentColors.background }}
              >
                Create First Product
              </button>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
