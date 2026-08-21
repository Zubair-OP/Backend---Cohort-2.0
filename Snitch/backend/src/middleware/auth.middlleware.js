import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import redis from "../config/cache.js";

async function verifyToken(req, res) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  const isBlacklisted = await redis.get(`bl:${token}`);
  if (isBlacklisted) {
    res.status(401).json({ message: "Unauthorized - Token is blacklisted" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    }
    return user;
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
}

export const authenticateUser = async (req, res, next) => {
  const user = await verifyToken(req, res);
  if (!user) return;
  req.user = user;
  next();
};

export const authenticateSeller = async (req, res, next) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (user.role !== "seller") {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.user = user;
  next();
};
