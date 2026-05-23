import expess from 'express';
const app = expess();
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan';
import helmet from 'helmet';


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(morgan('dev'))

// Routes
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import transcribeRoutes from './routes/transcribe.routes.js';

app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transcribe', transcribeRoutes);

export default app;
