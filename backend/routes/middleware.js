const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("JWT_SECREET",JWT_SECRET);
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
