import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

const ac = {
  background: '#fbf9f6',
  surface: '#ffffff',
  line: '#e4e2df',
  muted: '#7A6E63',
  text: '#1b1c1a',
  accent: '#C9A96E',
  subtle: '#B5ADA3',
  danger: '#b64848',
};

const inputStyle = {
  color: ac.text,
  borderBottom: `1px solid #d0c5b5`,
  fontFamily: "'Inter', sans-serif",
};

const MAX_VARIANT_IMAGES = 4;

const defaultVariantForm = {
  price: '',
  currency: 'PKR',
  stock: '',
  attributes: [{ key: '', value: '' }],
  images: [],
};

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-primary" style={{ color: ac.muted }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs leading-5 text-red-600">{error}</p>}
    </div>
  );
}

function handleFocus(e) { e.target.style.borderBottomColor = ac.accent; }
function handleBlur(e) { e.target.style.borderBottomColor = '#d0c5b5'; }

function VariantModal({ product, editingVariant, onClose, onSaved }) {
  const { handleAddVariant, handleUpdateVariant } = useProduct();
  const fileInputRef = useRef(null);
  const isEdit = !!editingVariant;

  const [form, setForm] = useState(() => {
    if (isEdit) {
      const attrs = editingVariant.attributes
        ? Object.entries(editingVariant.attributes).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }];
      return {
        price: editingVariant.price?.amount ?? '',
        currency: editingVariant.price?.currency || product.price?.currency || 'PKR',
        stock: editingVariant.stock ?? '',
        attributes: attrs.length ? attrs : [{ key: '', value: '' }],
        images: [],
      };
    }
    return { ...defaultVariantForm, currency: product.price?.currency || 'PKR' };
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function addAttr() {
    setForm((f) => ({ ...f, attributes: [...f.attributes, { key: '', value: '' }] }));
  }

  function removeAttr(idx) {
    setForm((f) => ({ ...f, attributes: f.attributes.filter((_, i) => i !== idx) }));
  }

  function updateAttr(idx, field, value) {
    setForm((f) => {
      const next = f.attributes.map((a, i) => (i === idx ? { ...a, [field]: value } : a));
      return { ...f, attributes: next };
    });
    setErrors((e) => ({ ...e, attributes: '' }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (imagePreviews.length + files.length > MAX_VARIANT_IMAGES) {
      toast.error(`Max ${MAX_VARIANT_IMAGES} images per variant.`);
      return;
    }

    const next = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...next]);
    setForm((f) => ({ ...f, images: [...f.images, ...next] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(id) {
    setImagePreviews((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((p) => p.id !== id);
    });
    setForm((f) => ({ ...f, images: f.images.filter((img) => img.id !== id) }));
  }

  function validate() {
    const errs = {};
    if (!form.stock.toString().trim() || Number(form.stock) < 0) {
      errs.stock = 'Enter a valid stock quantity.';
    }
    if (form.price !== '' && Number(form.price) < 0) {
      errs.price = 'Price cannot be negative.';
    }
    const filledAttrs = form.attributes.filter((a) => a.key.trim() || a.value.trim());
    const hasIncomplete = filledAttrs.some((a) => !a.key.trim() || !a.value.trim());
    if (hasIncomplete) {
      errs.attributes = 'Each attribute needs both a key and a value.';
    }
    const keys = filledAttrs.map((a) => a.key.trim().toLowerCase());
    if (new Set(keys).size !== keys.length) {
      errs.attributes = 'Attribute keys must be unique.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const attributesObj = {};
    form.attributes
      .filter((a) => a.key.trim() && a.value.trim())
      .forEach((a) => { attributesObj[a.key.trim()] = a.value.trim(); });

    const payload = {
      stock: Number(form.stock),
      price: form.price !== '' ? form.price : product.price?.amount,
      currency: form.currency || product.price?.currency || 'PKR',
      attributes: attributesObj,
      images: form.images,
    };

    try {
      setSubmitting(true);
      let response;
      if (isEdit) {
        response = await handleUpdateVariant(product._id, editingVariant._id, payload);
        toast.success('Variant updated.');
      } else {
        response = await handleAddVariant(product._id, payload);
        toast.success('Variant added.');
      }
      onSaved(response.product);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded border border-border-light bg-white px-6 py-7 md:px-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-sm text-text-secondary transition-all duration-300 hover:text-black"
        >
          Close
        </button>

        <div className="mb-7 border-b border-border-light pb-5">
          <p className="text-sm text-text-muted">
            {isEdit ? 'Edit variant' : 'Add variant'}
          </p>
          <h2 className="mt-2 text-3xl font-medium leading-tight text-text-primary">
            {isEdit ? 'Update variant details' : 'Create a new variant'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Stock" error={errors.stock}>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="0"
                className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 focus:border-black"
                style={inputStyle}
                disabled={submitting}
              />
            </FormField>

            <FormField label="Price Override (optional)" error={errors.price}>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={product.price?.amount || '-'}
                className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 focus:border-black"
                style={inputStyle}
                disabled={submitting}
              />
            </FormField>
          </div>

          <FormField label="Currency" error={errors.currency}>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm uppercase text-text-primary outline-none transition-all duration-300 focus:border-black"
              style={inputStyle}
              disabled={submitting}
            />
          </FormField>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Attributes</label>
              <button
                type="button"
                onClick={addAttr}
                className="rounded bg-black px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-gray-800"
              >
                Add
              </button>
            </div>

            {errors.attributes && (
              <p className="text-xs text-red-600">{errors.attributes}</p>
            )}

            {form.attributes.map((attr, idx) => (
              <div key={idx} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="text"
                  value={attr.key}
                  onChange={(e) => updateAttr(idx, 'key', e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="e.g. color"
                  className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 focus:border-black"
                  style={inputStyle}
                  disabled={submitting}
                />
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => updateAttr(idx, 'value', e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="e.g. red"
                  className="h-11 w-full rounded border border-border-default bg-white px-4 text-sm text-text-primary outline-none transition-all duration-300 focus:border-black"
                  style={inputStyle}
                  disabled={submitting}
                />
                {form.attributes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttr(idx)}
                    className="text-sm text-red-600 transition-all duration-300 hover:text-red-700"
                    disabled={submitting}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isEdit && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">
                Variant Images ({imagePreviews.length}/{MAX_VARIANT_IMAGES})
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded border border-border-default bg-bg-secondary px-4 py-4">
                <p className="text-sm text-text-primary">Upload images</p>
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
                  disabled={submitting}
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imagePreviews.map((preview) => (
                    <div key={preview.id} className="relative overflow-hidden rounded border border-border-light">
                      <img src={preview.url} alt="" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(preview.id)}
                        className="absolute right-2 top-2 rounded bg-black px-2 py-1 text-xs text-white"
                        disabled={submitting}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800 disabled:opacity-60"
            >
              {submitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Variant')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded border border-black px-8 py-3 text-sm font-normal text-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AttributeChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border-light bg-bg-secondary px-3 py-1 text-xs text-text-primary">
      <span className="text-text-muted">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function VariantCard({ variant, productCurrency, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const attrs = variant.attributes ? Object.entries(variant.attributes) : [];
  const priceAmount = variant.price?.amount;
  const priceCurrency = variant.price?.currency || productCurrency || 'PKR';

  const formatted =
    priceAmount != null
      ? new Intl.NumberFormat('en-PK', {
          style: 'currency',
          currency: priceCurrency,
          maximumFractionDigits: 0,
        }).format(priceAmount)
      : null;

  return (
    <article className="rounded border border-border-light bg-white px-5 py-4">
      {attrs.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {attrs.map(([k, v]) => (
            <AttributeChip key={k} label={k} value={v} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-text-muted">Stock</p>
              <p className="mt-1 text-xl font-medium text-text-primary">
                {variant.stock ?? 0}
              </p>
            </div>
            {formatted && (
              <div>
                <p className="text-sm text-text-muted">Price</p>
                <p className="mt-1 text-xl font-medium text-text-primary">
                  {formatted}
                </p>
              </div>
            )}
          </div>
          {variant.images?.length > 0 && (
            <p className="text-sm text-text-secondary">
              {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(variant)}
            className="rounded border border-black px-4 py-2 text-sm text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            Edit
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Confirm?</span>
              <button
                type="button"
                onClick={() => { onDelete(variant._id); setConfirmDelete(false); }}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded border border-border-default px-4 py-2 text-sm text-text-secondary"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded border border-red-600 px-4 py-2 text-sm text-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const SellerproductDetails = () => {
  const { Productid } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleDeleteVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await handleGetProductById(Productid);
        setProduct(data);
      } catch {
        toast.error('Could not load product.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [Productid]);

  function openAddModal() {
    setEditingVariant(null);
    setModalOpen(true);
  }

  function openEditModal(variant) {
    setEditingVariant(variant);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingVariant(null);
  }

  function handleSaved(updatedProduct) {
    setProduct(updatedProduct);
    closeModal();
  }

  async function handleDelete(variantId) {
    try {
      const response = await handleDeleteVariant(product._id, variantId);
      setProduct(response.product);
      toast.success('Variant removed.');
    } catch {
      toast.error('Failed to delete variant.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-primary">
        <p className="text-sm text-text-muted">Product not found</p>
        <button
          type="button"
          onClick={() => navigate('/Dashboard')}
          className="rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const coverImage = product.images?.[0]?.url;
  const variants = product.variants || [];

  return (
    <>
      <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <button
            type="button"
            onClick={() => navigate('/Dashboard')}
            className="self-start text-sm text-text-secondary transition-all duration-300 hover:text-black"
          >
            Back to dashboard
          </button>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded border border-border-light bg-bg-secondary">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={product.title}
                  className="h-80 w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-sm text-text-muted lg:h-full">
                  No image
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded border border-border-light bg-white px-6 py-7 md:px-8">
              <div>
                <p className="text-sm text-text-muted">Product details</p>
                <h1 className="mt-2 text-3xl font-medium leading-tight text-text-primary md:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-text-secondary">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border-light pt-5">
                <div>
                  <p className="text-sm text-text-muted">Base Price</p>
                  <p className="mt-1 text-base font-medium text-text-primary">
                    {new Intl.NumberFormat('en-PK', {
                      style: 'currency',
                      currency: product.price?.currency || 'PKR',
                      maximumFractionDigits: 0,
                    }).format(product.price?.amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Images</p>
                  <p className="mt-1 text-base font-medium text-text-primary">
                    {product.images?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Variants</p>
                  <p className="mt-1 text-base font-medium text-text-primary">
                    {variants.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <p className="text-sm text-text-muted">Variants</p>
                <h2 className="mt-2 text-2xl font-medium text-text-primary">
                  Manage product variants
                </h2>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800"
              >
                Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="rounded border border-dashed border-border-default bg-bg-secondary px-6 py-12 text-center">
                <p className="text-sm text-text-muted">No variants yet</p>
                <p className="mt-2 text-base text-text-secondary">
                  Add size, color, or any custom attribute combinations.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-6 rounded bg-black px-8 py-3 text-sm font-normal text-white transition-all duration-300 hover:bg-gray-800"
                >
                  Create First Variant
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {variants.map((variant) => (
                  <VariantCard
                    key={variant._id}
                    variant={variant}
                    productCurrency={product.price?.currency}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {modalOpen && (
        <VariantModal
          product={product}
          editingVariant={editingVariant}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default SellerproductDetails;
