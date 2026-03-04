const express = require('express');
const CookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const AuthRoutes = require('./routes/auth.routes');

app.use('/api/auth', AuthRoutes);


module.exports = app;
