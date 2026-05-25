import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import passport from 'passport';
import productRoutes from './routes/product.routes.js';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { config } from './config/config.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { handleWebhook } from './controllers/payment.controller.js';
import chatRoutes from './routes/chat.routes.js';
import helmet from 'helmet';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(morgan('dev'));
app.use(helmet());

// Stripe webhook needs the raw request body to verify the signature.
// This route MUST be registered before express.json() parses the body.
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);


export default app;
