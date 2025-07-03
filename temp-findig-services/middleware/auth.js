const { verifyToken, isTokenExpired } = require('../config/jwt');
const { errorResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return errorResponse(res, 'Access token required', 401);
    }

    // ตรวจสอบว่า token หมดอายุหรือไม่
    if (isTokenExpired(token)) {
        return errorResponse(res, 'Token has expired', 401);
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token', 403);
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Insufficient permissions', 403);
        }
        next();
    };
};

// Middleware สำหรับตรวจสอบว่าเป็น admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return errorResponse(res, 'Admin access required', 403);
    }
    next();
};

// Middleware สำหรับ optional authentication (ไม่บังคับ login)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            if (!isTokenExpired(token)) {
                const user = verifyToken(token);
                req.user = user;
            }
        } catch (error) {
            // ไม่ต้องทำอะไร ให้ผ่านไปได้
        }
    }
    
    next();
};

module.exports = { 
    authenticateToken, 
    requireRole, 
    requireAdmin,
    optionalAuth 
};