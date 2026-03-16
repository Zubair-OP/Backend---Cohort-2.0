import expess from 'express';
const app = expess();
import cookieParser from 'cookie-parser';


app.use(expess.json());
app.use(expess.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expess.static('public'));

// Routes
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

export default app;