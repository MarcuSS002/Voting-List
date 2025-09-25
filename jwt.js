const jwt = require('jsonwebtoken');

// ✅ Generate token with payload (id, role etc.)
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// ✅ Middleware to verify token
const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from "Bearer <token>"
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        // Verify and attach user info to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // { id, role, iat, exp }
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { jwtAuthMiddleware, generateToken };
