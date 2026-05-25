import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

const MAX_IMAGES = 7;
const CATEGORIES = ['shirts', 'pants', 'caps', 'hoodies', 'shoes', 'Kameez Shalwar'];

const defaultForm = {
  title: '',
  description: '',
  amount: '',
  currency: 'PKR',
  category: '',
};

const inputStyle = {
  color: '#1b1c1a',
  borderBottom: '1px solid #d0c5b5',
  fontFamily: "'Inter', sans-serif",
};

const accentColors = {
  background: '#fbf9f6',
  line: '#e4e2df',
  muted: '#7A6E63',
  text: '#1b1c1a',
  accent: '#C9A96E',
  subtle: '#B5ADA3',
};

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium text-text-primary"
        style={{ color: accentColors.muted }}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PreviewGrid({ previews, onRemove }) {
  if (!previews.length) {
    return (
      <div className="rounded border border-dashed border-border-default px-4 py-10 text-center text-sm text-text-muted">
        No images selected yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {previews.map((preview, index) => (
        <div
          key={preview.id}
          className="relative overflow-hidden rounded border border-border-light bg-white"
        >
          <img
            src={preview.url}
            alt={preview.file.name}
            className="h-32 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(preview.id)}
            className="absolute right-2 top-2 rounded bg-black px-3 py-1 text-xs text-white transition-all duration-300 hover:bg-gray-800"
          >
            Remove
          </button>
          <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-text-secondary">
            <span className="truncate">{preview.file.name}</span>
            <span>{index + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, []);

  const handleFocus = (event) => {
    event.target.style.borderBottomColor = accentColors.accent;
  };

  const handleBlur = (event) => {
    event.target.style.borderBottomColor = '#d0c5b5';
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    if (!formData.description.trim()) {
      nextErrors.description = 'Description is required.';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      nextErrors.amount = 'Enter a valid price amount.';
    }

    if (!formData.currency.trim()) {
      nextErrors.currency = 'Currency is required.';
    }

    if (!formData.category) {
      nextErrors.category = 'Please select a category.';
    }

    if (!previews.length) {
      nextErrors.images = 'Add at least one image.';
    }

    if (previews.length > MAX_IMAGES) {
      nextErrors.images = `You can upload up to ${MAX_IMAGES} images only.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setFormData(defaultForm);
    setPreviews([]);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const total = previews.length + selectedFiles.length;

    if (total > MAX_IMAGES) {
      setErrors((current) => ({
        ...current,
        images: `You can upload up to ${MAX_IMAGES} images only.`,
      }));
      toast.error(`You can upload up to ${MAX_IMAGES} images only.`);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    const nextPreviews = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews((current) => [...current, ...nextPreviews]);
    setErrors((current) => ({ ...current, images: '' }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id) => {
    setPreviews((current) => {
      const imageToRemove = current.find((preview) => preview.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return current.filter((preview) => preview.id !== id);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the highlighted product details.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('priceAmount', formData.amount);
    payload.append('priceCurrency', formData.currency.trim() || 'PKR');
    payload.append('category', formData.category);

    previews.forEach((preview) => {
      payload.append('images', preview.file);
    });

    try {
      setIsSubmitting(true);
      const response = await handleCreateProduct(payload);

      toast.success(response.message || 'Product successfully listed.');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong while adding the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sellerName = user?.fullname || user?.fullName || user?.name || 'Seller';
  const sellerEmail = user?.email || 'seller@snitch.com';
  const sellerRole = user?.role || 'seller';

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded border border-border-light bg-white px-6 py-7 md:px-8">
            <p className="text-sm text-text-muted">Seller workspace</p>
            <h1 className="mt-2 text-3xl font-medium leading-tight text-text-primary md:text-4xl">
              Welcome back, {sellerName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Create a clean product listing with strong imagery, clear pricing, and consistent presentation.
            </p>
          </div>

          <div className="rounded border border-border-light bg-bg-secondary px-6 py-7 md:px-8">
            <p className="text-sm text-text-muted">Seller info</p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-text-muted">Name</p>
                <p className="mt-1 text-base text-text-primary">{sellerName}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="mt-1 text-base text-text-primary">{sellerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Role</p>
                <p className="mt-1 text-base uppercase tracking-[0.08em] text-text-primary">
                  {sellerRole}
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded border border-border-light bg-white px-6 py-7 md:px-8">
            <div className="mb-8 border-b border-border-light pb-5">
              <p className="text-sm text-text-muted">Add new product</p>
              <h2 className="mt-2 text-3xl font-medium leading-tight text-text-primary">
                Create a polished new listing
              </h2>
            </div>

            <div className="space-y-6">
              <FormField label="Title" error={errors.title}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Classic linen shirt"
                  className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                  style={inputStyle}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Description" error={errors.description}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows={6}
                  placeholder="Write a clear, concise product description."
                  className="w-full rounded border border-border-default bg-white px-4 py-3 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                  style={inputStyle}
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Price Amount" error={errors.amount}>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="4990"
                    min="0"
                    className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                    style={inputStyle}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Currency" error={errors.currency}>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm uppercase text-text-primary outline-none transition-all duration-300 focus:border-black"
                    style={inputStyle}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              <FormField label="Category" error={errors.category}>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 focus:border-black disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded border border-border-light bg-white px-6 py-7 md:px-8">
              <FormField label={`Images (${previews.length}/${MAX_IMAGES})`} error={errors.images}>
                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded border border-border-default bg-bg-secondary px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Upload product images
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        JPG, PNG or WEBP. Maximum {MAX_IMAGES} images.
                      </p>
                    </div>
                    <span className="rounded bg-black px-4 py-2 text-sm text-white">
                      Browse
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>

                  <PreviewGrid previews={previews} onRemove={handleRemoveImage} />
                </div>
              </FormField>
            </div>

            <div className="rounded border border-border-light bg-bg-secondary px-6 py-7 md:px-8">
              <div className="mb-6 space-y-2 text-sm text-text-secondary">
                <p>Ready to publish your item?</p>
                <p>Make sure all key product details are complete and your imagery is clear.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Uploading Product...' : 'Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
