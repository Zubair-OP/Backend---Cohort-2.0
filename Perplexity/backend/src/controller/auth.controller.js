import userModel from "../model/user.model.js";
import {sendEmail} from "../services/mail.services.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const IsUserAlreadyExists = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

    if (IsUserAlreadyExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

        const user = await userModel.create({
            username,
            email,
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
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }


    if (!user.verified) {
        return res.status(403).json({ message: 'Please verify your email before logging in' });
    }
    

    const token = jwt.sign({ 
        id: user._id,
        username: user.username, 
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful', 
        user : {
            id: user._id,
            username: user.username,
            email: user.email
        }
     });
}


export const getme = async (req, res) => {  
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
        message: 'User details fetched successfully',
        user
     });
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

