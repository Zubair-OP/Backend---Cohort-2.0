import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

async function tokenResponse(user, res, message) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    message: message,
    success: true,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      contact: user.contact,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  try {
    const { fullname, email, password, contact, isSeller } = req.body;

    const existingUser = await usermodel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await usermodel.create({
      fullname: fullname,
      email: email,
      password: password,
      contact: contact,
      role: isSeller ? "seller" : "buyer",
    });

    await tokenResponse(newUser, res, "User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await tokenResponse(user, res, "User login successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleCallBack = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const ProfilePic = photos[0].value;

    let user = await usermodel.findOne({ email });

    if (!user) {
      user = await usermodel.create({
        fullname: displayName,
        email: email,
        googleId: id,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET || config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token);

    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  res.clearCookie("token");

  return res.status(200).json({ message: "User logged out successfully" });
};

export const getme = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id);

    return res.status(200).json({
      message: "User retrieved successfully",
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        contact: user.contact,
        role: user.role
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};