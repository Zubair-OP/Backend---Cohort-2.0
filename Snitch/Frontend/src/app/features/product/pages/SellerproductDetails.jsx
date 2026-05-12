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
      <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: ac.muted }}>
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] leading-5" style={{ color: ac.danger }}>{error}</p>}
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(27,28,26,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white px-6 py-7 sm:px-8"
        style={{ borderColor: ac.line, border: `1px solid ${ac.line}` }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[11px] uppercase tracking-[0.18em] px-3 py-1.5"
          style={{ color: ac.muted, border: `1px solid ${ac.line}` }}
        >
          Close
        </button>

        <div className="mb-7 border-b pb-5" style={{ borderColor: ac.line }}>
          <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: ac.accent }}>
            {isEdit ? 'Edit Variant' : 'Add Variant'}
          </p>
          <h2
            className="mt-1 text-[1.75rem] leading-[1.08]"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: ac.text }}
          >
            {isEdit ? 'Update variant details' : 'Create a new variant'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock + Price */}
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
                className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
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
                placeholder={product.price?.amount || '—'}
                className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
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
              className="w-full bg-transparent py-2 text-sm uppercase outline-none transition-colors duration-300"
              style={inputStyle}
              disabled={submitting}
            />
          </FormField>

          {/* Attributes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: ac.muted }}>
                Attributes
              </label>
              <button
                type="button"
                onClick={addAttr}
                className="text-[10px] uppercase tracking-[0.18em] px-3 py-1.5"
                style={{ backgroundColor: ac.text, color: ac.background }}
              >
                + Add
              </button>
            </div>

            {errors.attributes && (
              <p className="text-[11px]" style={{ color: ac.danger }}>{errors.attributes}</p>
            )}

            {form.attributes.map((attr, idx) => (
              <div key={idx} className="flex items-end gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => updateAttr(idx, 'key', e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. color"
                    className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
                    style={{ ...inputStyle, fontSize: '12px' }}
                    disabled={submitting}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttr(idx, 'value', e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. red"
                    className="w-full bg-transparent py-2 text-sm outline-none transition-colors duration-300"
                    style={{ ...inputStyle, fontSize: '12px' }}
                    disabled={submitting}
                  />
                </div>
                {form.attributes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttr(idx)}
                    className="pb-2 text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: ac.danger }}
                    disabled={submitting}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Variant Images */}
          {!isEdit && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: ac.muted }}>
                  Variant Images ({imagePreviews.length}/{MAX_VARIANT_IMAGES}) — Optional
                </label>
              </div>

              <label
                className="flex cursor-pointer items-center justify-between border px-4 py-3"
                style={{ borderColor: '#d9d0c2', backgroundColor: '#fcfaf7' }}
              >
                <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: ac.text }}>
                  Upload images
                </p>
                <span
                  className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em]"
                  style={{ backgroundColor: ac.text, color: ac.background }}
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
                  disabled={submitting}
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {imagePreviews.map((preview) => (
                    <div key={preview.id} className="relative overflow-hidden border" style={{ borderColor: ac.line }}>
                      <img src={preview.url} alt="" className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(preview.id)}
                        className="absolute right-1 top-1 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em]"
                        style={{ backgroundColor: 'rgba(27,28,26,0.8)', color: ac.background }}
                        disabled={submitting}
                      >
                        ×
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
              className="flex-1 py-3.5 text-[11px] uppercase tracking-[0.22em] font-medium disabled:opacity-60"
              style={{ backgroundColor: ac.text, color: ac.background }}
            >
              {submitting ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Variant')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] font-medium disabled:opacity-60"
              style={{ border: `1px solid ${ac.line}`, color: ac.muted }}
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
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
      style={{ backgroundColor: '#f3efe9', color: ac.text, border: `1px solid ${ac.line}` }}
    >
      <span style={{ color: ac.subtle }}>{label}</span>
      <span style={{ color: ac.text }}>{value}</span>
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
    <article
      className="border bg-white px-5 py-4"
      style={{ borderColor: ac.line }}
    >
      {attrs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {attrs.map(([k, v]) => (
            <AttributeChip key={k} label={k} value={v} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ac.subtle }}>
                Stock
              </p>
              <p className="mt-0.5 text-lg font-medium" style={{ color: ac.text }}>
                {variant.stock ?? 0}
              </p>
            </div>
            {formatted && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ac.subtle }}>
                  Price
                </p>
                <p className="mt-0.5 text-lg font-medium" style={{ color: ac.text }}>
                  {formatted}
                </p>
              </div>
            )}
          </div>
          {variant.images?.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: ac.subtle }}>
              {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(variant)}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.18em]"
            style={{ border: `1px solid ${ac.line}`, color: ac.muted }}
          >
            Edit
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: ac.danger }}>
                Confirm?
              </span>
              <button
                type="button"
                onClick={() => { onDelete(variant._id); setConfirmDelete(false); }}
                className="px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
                style={{ backgroundColor: ac.danger, color: '#fff' }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
                style={{ border: `1px solid ${ac.line}`, color: ac.muted }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.18em]"
              style={{ border: `1px solid ${ac.danger}`, color: ac.danger }}
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: ac.background }}
      >
        <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: ac.subtle }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: ac.background }}
      >
        <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: ac.subtle }}>
          Product not found
        </p>
        <button
          type="button"
          onClick={() => navigate('/Dashboard')}
          className="px-6 py-2.5 text-[11px] uppercase tracking-[0.22em]"
          style={{ backgroundColor: ac.text, color: ac.background }}
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
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen px-6 py-8 sm:px-10 lg:px-16"
        style={{ backgroundColor: ac.background, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-8">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/Dashboard')}
            className="self-start text-[10px] uppercase tracking-[0.2em]"
            style={{ color: ac.muted }}
          >
            ← Dashboard
          </button>

          {/* Product Overview */}
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div
              className="overflow-hidden border"
              style={{ borderColor: ac.line, backgroundColor: '#f3efe9' }}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={product.title}
                  className="h-72 w-full object-cover lg:h-full"
                />
              ) : (
                <div
                  className="flex h-72 items-center justify-center text-[11px] uppercase tracking-[0.18em] lg:h-full"
                  style={{ color: ac.subtle }}
                >
                  No image
                </div>
              )}
            </div>

            <div
              className="border bg-white px-6 py-7 sm:px-8 flex flex-col justify-between"
              style={{ borderColor: ac.line }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: ac.accent }}>
                  Product Details
                </p>
                <h1
                  className="mt-2 text-[2rem] leading-[1.05] sm:text-[2.4rem]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: ac.text }}
                >
                  {product.title}
                </h1>
                <p className="mt-3 text-sm leading-7" style={{ color: ac.muted }}>
                  {product.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-5" style={{ borderColor: ac.line }}>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ac.subtle }}>Base Price</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: ac.text }}>
                    {new Intl.NumberFormat('en-PK', {
                      style: 'currency',
                      currency: product.price?.currency || 'PKR',
                      maximumFractionDigits: 0,
                    }).format(product.price?.amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ac.subtle }}>Images</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: ac.text }}>
                    {product.images?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ac.subtle }}>Variants</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: ac.text }}>
                    {variants.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Variants Section */}
          <section>
            <div
              className="flex items-center justify-between border-b pb-4 mb-5"
              style={{ borderColor: ac.line }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: ac.accent }}>
                  Variants
                </p>
                <h2
                  className="mt-1 text-[1.6rem] leading-[1.06]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: ac.text }}
                >
                  Manage product variants
                </h2>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="px-5 py-3 text-[11px] uppercase tracking-[0.22em] font-medium whitespace-nowrap"
                style={{ backgroundColor: ac.text, color: ac.background }}
              >
                + Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div
                className="border border-dashed px-6 py-10 text-center"
                style={{ borderColor: '#d9d0c2' }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: ac.subtle }}>
                  No variants yet
                </p>
                <p className="mt-2 text-sm" style={{ color: ac.muted }}>
                  Add size, color, voltage, or any custom attribute combinations.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-5 px-6 py-2.5 text-[11px] uppercase tracking-[0.22em]"
                  style={{ backgroundColor: ac.text, color: ac.background }}
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
