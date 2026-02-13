const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}

module.exports = authMiddleware;