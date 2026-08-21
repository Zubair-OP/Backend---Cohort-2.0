import { Router } from 'express';
import ProductModel from '../models/product.model.js';

const router = Router();

const SITE_URL = 'https://snitch.store';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const products = await ProductModel.find({}).select('_id updatedAt').lean();

    const staticPages = [
      { loc: SITE_URL + '/', changefreq: 'daily', priority: '1.0' },
      { loc: SITE_URL + '/login', changefreq: 'monthly', priority: '0.3' },
      { loc: SITE_URL + '/register', changefreq: 'monthly', priority: '0.3' },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(page.loc)}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    for (const product of products) {
      const productUrl = `${SITE_URL}/product/${product._id}`;
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(productUrl)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation failed:', error.message);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
