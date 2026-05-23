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
import helmet from 'helmet';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));


app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


export default app;
