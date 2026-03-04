const jwt = require("jsonwebtoken");
const redis = require('../config/cache');

const authMiddleware = async (req,res,next) =>{
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }

        const isBlacklisted = await redis.get(token);

        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized - Token is blacklisted" });
        }

        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
}}

module.exports = authMiddleware;