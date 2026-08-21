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
      <article className="group overflow-hidden rounded-4xl border border-border-light bg-white transition-all duration-600 ease-premium hover:border-accent hover:shadow-[0_8px_30px_-10px_rgba(201,169,110,0.15)]">
        <div className="overflow-hidden bg-cream">
          <div className="aspect-[4/5] overflow-hidden bg-cream">
            {coverImage ? (
              <img
                src={coverImage}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
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

        <div className="space-y-3 px-5 py-5">
          <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
            <p>Listed {formatDate(product.createdAt)}</p>
            <span>{product?.images?.length || 0} image{product?.images?.length === 1 ? '' : 's'}</span>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium leading-7 text-text-primary">
              {product.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <p className="text-base font-semibold text-accent">
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
    <div className="min-h-screen bg-cream text-text-primary">
      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="glass rounded-full px-5 py-3 md:px-8 md:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex cursor-pointer items-center gap-1 text-sm font-bold tracking-[0.25em] text-black" onClick={() => navigate('/')}>
                  <span className="rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs">SN</span>
                  <span className="text-xs tracking-[0.3em]">ITCH</span>
                </div>
                <span className="rounded-full bg-bg-dark px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
                  Seller Console
                </span>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-xs font-medium text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                >
                  View Storefront
                </button>
                <div className="h-4 w-px bg-border-light" />
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                    {sellerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden font-medium text-text-secondary md:inline">
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
                    className="font-medium text-text-muted transition-colors duration-600 ease-premium hover:text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 flex flex-col gap-10">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col justify-between rounded-4xl border border-border-light bg-white px-7 py-8 md:px-9">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Merchant Portal</p>
              <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-text-primary md:text-4xl">
                {sellerName}&apos;s product catalog
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
                Review your listed products, monitor catalog value, and keep the storefront aligned with the same clean Snitch presentation.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/create-product')}
                className="btn-magnetic rounded-full bg-bg-dark px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
              >
                Add New Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-magnetic rounded-full border border-border-light px-6 py-2.5 text-xs font-medium text-text-primary transition-all duration-600 ease-premium hover:border-bg-dark hover:bg-bg-dark hover:text-white"
              >
                Browse Storefront
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-4xl border border-border-light bg-warm-gray/50 px-7 py-8 md:px-9">
            <div className="space-y-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Total Products</p>
                <p className="mt-1.5 font-serif text-4xl font-semibold text-text-primary">{totalProducts}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Catalog Value</p>
                <p className="mt-1.5 font-serif text-3xl font-semibold text-text-primary">
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
            className="rounded-full border border-border-light bg-white px-4 py-2.5 text-sm text-text-primary transition-all duration-600 ease-premium focus:border-accent focus:outline-none"
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-4xl border border-border-light bg-white">
                <div className="aspect-[4/5] animate-pulse bg-warm-gray" />
                <div className="space-y-3 px-5 py-5">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-warm-gray" />
                  <div className="h-6 w-3/4 animate-pulse rounded-full bg-warm-gray" />
                  <div className="h-12 animate-pulse rounded-2xl bg-warm-gray/50" />
                </div>
              </div>
            ))}
          </div>
        ) : totalProducts === 0 ? (
          <section className="rounded-4xl border border-border-light bg-warm-gray/30 px-6 py-20 text-center">
            <p className="text-sm text-text-muted">Nothing listed yet</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-text-primary">
              Your storefront is ready for its first product
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Create one polished listing and it will appear here automatically once published.
            </p>
            <button
              type="button"
              onClick={() => navigate('/create-product')}
              className="btn-magnetic mt-8 rounded-full bg-bg-dark px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
            >
              Create First Product
            </button>
          </section>
        ) : filteredProducts.length === 0 ? (
          <section className="rounded-4xl border border-border-light bg-warm-gray/30 px-6 py-20 text-center">
            <p className="text-sm text-text-muted">No products found</p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-text-primary">
              No products in &ldquo;{selectedCategory}&rdquo; category
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
              You have no products listed under this category yet.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="btn-magnetic mt-6 rounded-full border border-border-light px-6 py-2.5 text-sm font-medium text-text-primary transition-all duration-600 ease-premium hover:border-bg-dark hover:bg-bg-dark hover:text-white"
            >
              Show all products
            </button>
          </section>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
