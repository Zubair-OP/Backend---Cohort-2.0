const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const userRoutes = require('./routes/user.routes');

// Correct CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.use('/api/users', userRoutes);
app.use('/api/post', upload.single('image'), userRoutes);
app.use('/api/album', upload.array('images', 5), userRoutes);
app.use('/api/post', userRoutes);


app.use('*name', (req, res) => {
    res.send(path.join(__dirname, '..', '/public/index.html'));
})

module.exports = app;


