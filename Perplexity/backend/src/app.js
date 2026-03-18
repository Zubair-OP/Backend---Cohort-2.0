import expess from 'express';
const app = expess();
import cookieParser from 'cookie-parser';
import cors from 'cors'


app.use(expess.json());
app.use(expess.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expess.static('public'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Routes
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

export default app;