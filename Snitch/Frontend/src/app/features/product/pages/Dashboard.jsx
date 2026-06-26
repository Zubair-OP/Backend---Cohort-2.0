import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';

const CATEGORIES = ['shirts', 'pants', 'caps', 'hoodies', 'shoes', 'Kameez Shalwar'];

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
    <Link to={`/seller-product/${product._id}`} className="block">
      <article className="group overflow-hidden rounded border border-border-light bg-white transition-all duration-300 hover:border-black">
        <div className="overflow-hidden bg-white">
          <div className="aspect-[4/5] overflow-hidden bg-white">
            {coverImage ? (
              <img
                src={coverImage}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
            <p>Listed {formatDate(product.createdAt)}</p>
            <span>{product?.images?.length || 0} image{product?.images?.length === 1 ? '' : 's'}</span>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-7 text-text-primary">
              {product.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <p className="text-base font-medium text-text-primary">
              {formatCurrency(amount, currency)}
            </p>
            <p className="text-sm text-text-secondary">Manage</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredProducts =
    selectedCategory === 'all'
      ? (products || [])
      : (products || []).filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Seller Console Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-border-light bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex cursor-pointer items-center gap-1 text-sm font-bold tracking-[0.25em] text-black" onClick={() => navigate('/')}>
              <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
              <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
            </div>
            <span className="rounded bg-black px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
              Seller Console
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-medium text-neutral-600 transition-colors hover:text-black"
            >
              View Storefront
            </button>
            <div className="h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-3 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-800">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden font-medium text-neutral-700 md:inline">
                Hi, {sellerName}
              </span>
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
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 flex flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col justify-between rounded border border-border-light bg-white px-6 py-7 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Merchant Portal</p>
              <h1 className="mt-2 text-3xl font-medium leading-tight text-text-primary md:text-4xl">
                {sellerName}&apos;s product catalog
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
                Review your listed products, monitor catalog value, and keep the storefront aligned with the same clean Snitch presentation.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/create-product')}
                className="rounded bg-black px-6 py-2.5 text-xs font-normal text-white transition-all duration-300 hover:bg-gray-800"
              >
                Add New Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded border border-black px-6 py-2.5 text-xs font-normal text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                Browse Storefront
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded border border-border-light bg-neutral-50 px-6 py-7 md:px-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Products</p>
                <p className="mt-1 text-4xl font-semibold text-text-primary">{totalProducts}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Catalog Value</p>
                <p className="mt-1 text-3xl font-semibold text-text-primary">
                  {formatCurrency(totalValue, primaryCurrency)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <label htmlFor="category-filter" className="text-sm text-text-muted whitespace-nowrap">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded border border-border-light bg-white px-3 py-2 text-sm text-text-primary focus:border-black focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {selectedCategory !== 'all' && (
            <span className="text-sm text-text-muted">
              {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded border border-border-light bg-white">
                <div className="aspect-[4/5] animate-pulse bg-bg-secondary" />
                <div className="space-y-3 px-4 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
                  <div className="h-12 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : totalProducts === 0 ? (
          <section className="rounded border border-border-light bg-bg-secondary px-6 py-16 text-center">
            <p className="text-sm text-text-muted">Nothing listed yet</p>
            <h2 className="mt-3 text-3xl font-medium text-text-primary">
              Your storefront is ready for its first product
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Create one polished listing and it will appear here automatically once published.
            </p>
            <button
              type="button"
              onClick={() => navigate('/create-product')}
              className="mt-8 rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800"
            >
              Create First Product
            </button>
          </section>
        ) : filteredProducts.length === 0 ? (
          <section className="rounded border border-border-light bg-bg-secondary px-6 py-16 text-center">
            <p className="text-sm text-text-muted">No products found</p>
            <h2 className="mt-3 text-2xl font-medium text-text-primary">
              No products in &ldquo;{selectedCategory}&rdquo; category
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
              You have no products listed under this category yet.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="mt-6 rounded border border-black px-6 py-2.5 text-sm text-text-primary transition-all duration-300 hover:bg-black hover:text-white"
            >
              Show all products
            </button>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
