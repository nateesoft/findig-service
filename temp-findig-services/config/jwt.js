const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your_fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
};

// สร้าง JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm
    });
};

// ตรวจสอบ JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// ถอดรหัส Token โดยไม่ตรวจสอบ signature (ใช้เมื่อต้องการดูข้อมูลใน payload)
const decodeToken = (token) => {
    return jwt.decode(token);
};

// ตรวจสอบว่า Token หมดอายุหรือไม่
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded.exp) return false;
        
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// สร้าง Refresh Token (อายุยาวกว่า Access Token)
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: '7d', // 7 วัน
        algorithm: jwtConfig.algorithm
    });
};

module.exports = {
    jwtConfig,
    generateToken,
    verifyToken,
    decodeToken,
    isTokenExpired,
    generateRefreshToken
};