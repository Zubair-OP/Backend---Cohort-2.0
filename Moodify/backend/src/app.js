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
const SongRoutes = require('./routes/song.routes');
const MoodHistoryRoutes = require('./routes/moodHistory.routes');

app.use('/api/auth', AuthRoutes);
app.use('/api/songs', SongRoutes);
app.use('/api/mood-history', MoodHistoryRoutes);


module.exports = app;
