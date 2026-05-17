import userModel from "../model/user.model.js";
import jwt from 'jsonwebtoken';

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
    };
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const normalizedEmail = email.toLowerCase().trim();
        const IsUserAlreadyExists = await userModel.findOne({
            $or: [
                { username },
                { email: normalizedEmail }
            ]
        });

        if (IsUserAlreadyExists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await userModel.create({
            username,
            email: normalizedEmail,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Register error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, getCookieOptions());

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
}

export const getme = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Get current user error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch current user'
        });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
}
