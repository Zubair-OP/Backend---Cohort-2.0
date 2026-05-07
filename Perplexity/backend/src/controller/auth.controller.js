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

function getBackendUrl(req) {
    return process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
}

function getFrontendUrl(value) {
    const fallbackUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const url = new URL(value || fallbackUrl);
        return url.origin;
    } catch {
        return fallbackUrl;
    }
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const verificationUrlBase = getBackendUrl(req);
        const frontendUrl = getFrontendUrl(req.get("origin"));

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
        frontendUrl,
        }, process.env.JWT_SECRET)
        const verificationUrl = `${verificationUrlBase}/api/auth/verify-email?token=${emailVerificationToken}`;

        let emailSent = false;
        try {
            await sendEmail({
                to: user.email,
                subject: "Welcome to Perplexity!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937;">
                        <h2 style="margin-bottom: 16px;">Welcome to Perplexity, ${username}!</h2>
                        <p style="margin-bottom: 16px;">Thank you for registering. Please verify your email address to activate your account.</p>
                        <div style="margin: 24px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">
                                Verify Email
                            </a>
                        </div>
                        <p style="margin-bottom: 8px;">If the button does not work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; margin-bottom: 16px;">
                            <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
                        </p>
                        <p style="margin-bottom: 0;">If you did not create an account, you can safely ignore this email.</p>
                    </div>
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
    
        const loginUrl = `${getFrontendUrl(decoded.frontendUrl)}/login`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 40px auto; padding: 24px; color: #1f2937; text-align: center;">
                <h1 style="margin-bottom: 16px;">Email Verified Successfully</h1>
                <p style="margin-bottom: 24px;">Your email has been verified. You can now log in to your account.</p>
                <a href="${loginUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">
                    Go to Login
                </a>
            </div>
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
