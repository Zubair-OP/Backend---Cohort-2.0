import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

const MAX_IMAGES = 7;
const defaultForm = {
  title: '',
  description: '',
  amount: '',
  currency: 'PKR',
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
        className="text-[10px] uppercase tracking-[0.18em] font-medium"
        style={{ color: accentColors.muted }}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] leading-5" style={{ color: '#b64848' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PreviewGrid({ previews, onRemove }) {
  if (!previews.length) {
    return (
      <div
        className="border border-dashed px-4 py-8 text-center text-[11px] uppercase tracking-[0.16em]"
        style={{ borderColor: '#d9d0c2', color: accentColors.subtle }}
      >
        No images selected yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {previews.map((preview, index) => (
        <div
          key={preview.id}
          className="relative overflow-hidden border"
          style={{ borderColor: accentColors.line }}
        >
          <img
            src={preview.url}
            alt={preview.file.name}
            className="h-28 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(preview.id)}
            className="absolute right-2 top-2 h-7 min-w-7 px-2 text-[10px] uppercase tracking-[0.14em] transition-colors"
            style={{ backgroundColor: 'rgba(27,28,26,0.82)', color: accentColors.background }}
          >
            Remove
          </button>
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.12em]"
            style={{ backgroundColor: '#f7f2ea', color: accentColors.muted }}
          >
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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen px-6 py-8 sm:px-10 lg:px-16"
        style={{ backgroundColor: accentColors.background, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div
              className="border bg-white px-6 py-7 sm:px-8"
              style={{ borderColor: accentColors.line }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: accentColors.accent }}
              >
                Seller Workspace
              </p>
              <h1
                className="mt-2 text-[2.2rem] leading-[1.05] sm:text-[2.8rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: accentColors.text }}
              >
                Welcome back, {sellerName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7" style={{ color: accentColors.muted }}>
                Keep your catalog sharp, upload new arrivals, and manage your store with the same calm flow as the rest of Snitch.
              </p>
            </div>

            <div
              className="border bg-white px-6 py-7 sm:px-8"
              style={{ borderColor: accentColors.line }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.18em] font-medium"
                style={{ color: accentColors.subtle }}
              >
                Seller Info
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
                    Name
                  </p>
                  <p className="mt-1 text-sm" style={{ color: accentColors.text }}>{sellerName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
                    Email
                  </p>
                  <p className="mt-1 text-sm" style={{ color: accentColors.text }}>{sellerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColors.subtle }}>
                    Role
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.16em]" style={{ color: accentColors.text }}>
                    {sellerRole}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-2">
            {/* Left side: Product Details */}
            <div
              className="border bg-white px-6 py-7 sm:px-8"
              style={{ borderColor: accentColors.line }}
            >
              <div className="mb-8 border-b pb-5" style={{ borderColor: accentColors.line }}>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: accentColors.accent }}
                >
                  Add New Product
                </p>
                <h2
                  className="mt-2 text-[2rem] leading-[1.08]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: accentColors.text }}
                >
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
                    className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
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
                    rows={5}
                    placeholder="Write a clear, concise product description."
                    className="w-full resize-none bg-transparent py-2 text-sm outline-none transition-colors duration-300"
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
                      className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
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
                      className="w-full bg-transparent py-2 text-sm uppercase outline-none transition-colors duration-300"
                      style={inputStyle}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Right side: Images and Publish */}
            <div className="flex flex-col gap-6">
              <div
                className="border bg-white px-6 py-7 sm:px-8"
                style={{ borderColor: accentColors.line }}
              >
                <FormField label={`Images (${previews.length}/${MAX_IMAGES})`} error={errors.images}>
                  <div className="space-y-4">
                    <label
                      className="flex cursor-pointer items-center justify-between border px-4 py-4 transition-colors"
                      style={{ borderColor: '#d9d0c2', backgroundColor: '#fcfaf7' }}
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: accentColors.text }}>
                          Upload product images
                        </p>
                        <p className="mt-1 text-sm" style={{ color: accentColors.muted }}>
                          JPG, PNG or WEBP. Maximum {MAX_IMAGES} images.
                        </p>
                      </div>
                      <span
                        className="px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                        style={{ backgroundColor: accentColors.text, color: accentColors.background }}
                      >
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

              <div
                className="border bg-white px-6 py-7 sm:px-8"
                style={{ borderColor: accentColors.line }}
              >
                <div className="mb-6 space-y-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: accentColors.muted }}>
                  <p>Ready to publish your item?</p>
                  <p>Ensure all product details are correctly entered and images are uploaded clearly.</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 shadow-sm hover:shadow-md"
                  style={{ backgroundColor: accentColors.text, color: accentColors.background }}
                >
                  {isSubmitting ? 'Uploading Product...' : 'Publish Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
