import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import authRoutes from './routes/auth.routes.js';
import passport from 'passport';
import productRoutes from './routes/product.routes.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config/config.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { handleWebhook } from './controllers/payment.controller.js';
import chatRoutes from './routes/chat.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { generalLimiter } from './middleware/rateLimit.js';

const app = express();
app.set('trust proxy', 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDir = fs.existsSync(path.resolve(__dirname, '../public'))
    ? path.resolve(__dirname, '../public')
    : path.resolve(__dirname, '../dist');

app.use(cors({
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
}));

app.use(morgan('combined'));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://js.stripe.com'],
            scriptSrcElem: ["'self'", 'https://js.stripe.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://ik.imagekit.io'],
            connectSrc: ["'self'", 'https://api.stripe.com', 'https://js.stripe.com'],
            frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Stripe webhook needs the raw request body to verify the signature.
// This route MUST be registered before express.json() parses the body.
app.use('/api/payments/webhook', express.raw({ type: 'application/json', limit: '1mb' }), handleWebhook);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
    maxAge: '1d',
    etag: true,
}));
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
app.use(express.static(staticDir, {
    maxAge: '1h',
    etag: true,
}));

app.use(generalLimiter);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use(sitemapRoutes);

app.get('{*splat}', (req, res) => {
    res.sendFile(path.resolve(staticDir, 'index.html'));
});

app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
