const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../config/cache');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const IsUserAlreadyExists = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (IsUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log("Register error:", error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
}

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token);

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }
}

const logout = async (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    await redis.set(token, Date.now().toString(), 'EX', 60 * 60);

    res.clearCookie('token');

    return res.status(200).json({ message: 'User logged out successfully' });
}

const getme = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);

        return res.status(200).json({
            message: 'User retrieved successfully',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = {
    register,
    login,
    logout,
    getme
}