import userModel from "../model/user.model.js";
import {sendEmail} from "../services/mail.services.js";
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

        const emailVerificationToken = jwt.sign({
        email: user.email,
        }, process.env.JWT_SECRET)

        let emailSent = false;
        try {
            await sendEmail({
                to: user.email,
                subject: "Welcome to Perplexity!",
                html: `
                    <p>Hi ${username},</p>
                    <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Best regards,<br>The Perplexity Team</p>
                `,
            });
            emailSent = true;
        } catch (error) {
            console.error("Registration email failed:", error.message || error);
        }

        res.status(201).json({
            success: true,
            message: emailSent
                ? 'User registered successfully. Verification email sent.'
                : 'User registered successfully, but verification email could not be sent. Please contact support or retry later.',
            emailSent,
            user : {
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

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
    
        if (!token) {
            return res.status(400).json({ message: 'Invalid or missing token' });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await userModel.findOne({ email: decoded.email });


        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }
            
        user.verified = true;
        await user.save();
    
        const html = `
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now log in to your account.</p>
            <a href="http://localhost:3000/login">Go to Login</a>
        `;
        return res.send(html);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
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


        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
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
            user : {
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
                verified: user.verified
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

