import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Snitch';
const SITE_URL = 'https://snitch.store';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const defaults = {
  title: `${SITE_NAME} — Premium Everyday Clothing for Men & Women | Shop Pakistan`,
  description: `Shop Snitch's curated collection of premium everyday clothing. Shirts, pants, hoodies, caps, and Kameez Shalwar designed for comfort and style. Free delivery across Pakistan.`,
  image: DEFAULT_IMAGE,
  url: SITE_URL,
  type: 'website',
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  product = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : defaults.title;
  const metaDescription = description || defaults.description;
  const metaImage = image || defaults.image;
  const metaUrl = url || defaults.url;

  const jsonLd = [];

  if (product) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.images?.[0]?.url || metaImage,
      url: `${SITE_URL}/product/${product._id}`,
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        priceCurrency: product.price?.currency || 'PKR',
        price: product.price?.amount || 0,
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/product/${product._id}`,
      },
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
