const express = require('express');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(CookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

const AuthRoutes = require('./routes/auth.routes');
const SongRoutes = require('./routes/song.routes');
const MoodHistoryRoutes = require('./routes/moodHistory.routes');

app.use('/api/auth', AuthRoutes);
app.use('/api/songs', SongRoutes);
app.use('/api/mood-history', MoodHistoryRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.get('{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = app;
