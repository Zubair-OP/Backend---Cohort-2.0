const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.use('/api/users', userRoutes);
app.use('/api/post', upload.single('image'), userRoutes);
app.use('/api/album', upload.array('images', 5), userRoutes);
app.use('/api/post', userRoutes);

module.exports = app;


