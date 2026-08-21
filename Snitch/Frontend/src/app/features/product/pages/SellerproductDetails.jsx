import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProduct } from '../hook/useProduct';

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
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      {children}
      {error && <p className="text-xs leading-5 text-red-500">{error}</p>}
    </div>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-border-light bg-white px-7 py-8 md:px-9">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-sm text-text-secondary transition-all duration-600 ease-premium hover:text-black"
        >
          Close
        </button>

        <div className="mb-7 border-b border-border-light pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
            {isEdit ? 'Edit variant' : 'Add variant'}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-text-primary">
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
                placeholder="0"
                className="h-11 w-full rounded-full border border-border-light bg-cream px-5 text-sm text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
                disabled={submitting}
              />
            </FormField>

            <FormField label="Price Override (optional)" error={errors.price}>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder={product.price?.amount || '-'}
                className="h-11 w-full rounded-full border border-border-light bg-cream px-5 text-sm text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
                disabled={submitting}
              />
            </FormField>
          </div>

          <FormField label="Currency" error={errors.currency}>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
              className="h-11 w-full rounded-full border border-border-light bg-cream px-5 text-sm uppercase text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
              disabled={submitting}
            />
          </FormField>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-text-secondary">Attributes</label>
              <button
                type="button"
                onClick={addAttr}
                className="rounded-full bg-bg-dark px-4 py-2 text-sm font-medium text-white transition-all duration-600 ease-premium hover:bg-black"
              >
                Add
              </button>
            </div>

            {errors.attributes && (
              <p className="text-xs text-red-500">{errors.attributes}</p>
            )}

            {form.attributes.map((attr, idx) => (
              <div key={idx} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="text"
                  value={attr.key}
                  onChange={(e) => updateAttr(idx, 'key', e.target.value)}
                  placeholder="e.g. color"
                  className="h-11 w-full rounded-full border border-border-light bg-cream px-5 text-sm text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
                  disabled={submitting}
                />
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => updateAttr(idx, 'value', e.target.value)}
                  placeholder="e.g. red"
                  className="h-11 w-full rounded-full border border-border-light bg-cream px-5 text-sm text-text-primary outline-none transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
                  disabled={submitting}
                />
                {form.attributes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttr(idx)}
                    className="text-sm text-red-500 transition-all duration-600 ease-premium hover:text-red-600"
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
              <label className="text-[13px] font-medium text-text-secondary">
                Variant Images ({imagePreviews.length}/{MAX_VARIANT_IMAGES})
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border-light bg-warm-gray/30 px-5 py-5 transition-all duration-600 ease-premium hover:border-accent">
                <p className="text-sm font-medium text-text-primary">Upload images</p>
                <span className="rounded-full bg-bg-dark px-5 py-2.5 text-sm font-medium text-white">
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
                    <div key={preview.id} className="relative overflow-hidden rounded-2xl border border-border-light">
                      <img src={preview.url} alt="" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(preview.id)}
                        className="absolute right-2 top-2 rounded-full bg-bg-dark px-2.5 py-1 text-xs text-white"
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
              className="btn-magnetic flex-1 rounded-full bg-bg-dark px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Variant')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full border border-border-light px-8 py-3 text-sm font-medium text-text-primary transition-all duration-600 ease-premium hover:border-bg-dark hover:bg-bg-dark hover:text-white disabled:opacity-60"
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
    <span className="inline-flex items-center gap-1 rounded-full border border-border-light bg-warm-gray/50 px-3 py-1 text-xs text-text-primary">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium">{value}</span>
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
    <article className="rounded-4xl border border-border-light bg-white px-6 py-5">
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
              <p className="mt-1 font-serif text-xl font-medium text-text-primary">
                {variant.stock ?? 0}
              </p>
            </div>
            {formatted && (
              <div>
                <p className="text-sm text-text-muted">Price</p>
                <p className="mt-1 font-serif text-xl font-medium text-accent">
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
            className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-text-primary transition-all duration-600 ease-premium hover:border-bg-dark hover:bg-bg-dark hover:text-white"
          >
            Edit
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-500">Confirm?</span>
              <button
                type="button"
                onClick={() => { onDelete(variant._id); setConfirmDelete(false); }}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-full border border-border-light px-4 py-2 text-sm text-text-secondary"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-full border border-red-400 px-4 py-2 text-sm font-medium text-red-500 transition-all duration-600 ease-premium hover:bg-red-500 hover:text-white"
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
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream">
        <p className="text-sm text-text-muted">Product not found</p>
        <button
          type="button"
          onClick={() => navigate('/Dashboard')}
          className="rounded-full bg-bg-dark px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black"
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
      <div className="min-h-screen bg-cream px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <button
            type="button"
            onClick={() => navigate('/Dashboard')}
            className="self-start text-sm font-medium text-text-secondary transition-all duration-600 ease-premium hover:text-black"
          >
            ← Back to dashboard
          </button>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="double-bezel">
              <div className="double-bezel-inner overflow-hidden">
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
            </div>

            <div className="flex flex-col justify-between rounded-4xl border border-border-light bg-white px-7 py-8 md:px-9">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Product details</p>
                <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-text-primary md:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-text-secondary">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border-light pt-6">
                <div>
                  <p className="text-sm text-text-muted">Base Price</p>
                  <p className="mt-1 text-base font-semibold text-accent">
                    {new Intl.NumberFormat('en-PK', {
                      style: 'currency',
                      currency: product.price?.currency || 'PKR',
                      maximumFractionDigits: 0,
                    }).format(product.price?.amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Images</p>
                  <p className="mt-1 text-base font-semibold text-text-primary">
                    {product.images?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Variants</p>
                  <p className="mt-1 text-base font-semibold text-text-primary">
                    {variants.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between border-b border-border-light pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Variants</p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-text-primary">
                  Manage product variants
                </h2>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="btn-magnetic rounded-full bg-bg-dark px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
              >
                Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-border-light bg-warm-gray/30 px-6 py-14 text-center">
                <p className="text-sm text-text-muted">No variants yet</p>
                <p className="mt-2 text-base text-text-secondary">
                  Add size, color, or any custom attribute combinations.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="btn-magnetic mt-6 rounded-full bg-bg-dark px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
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
