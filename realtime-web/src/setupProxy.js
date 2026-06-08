require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const backendHost = process.env.BACKEND_HOST || 'http://127.0.0.1:9090';
    const backendPrefix = process.env.BACKEND_PREFIX || 'realtime-service';
    app.use(
        createProxyMiddleware({
            target: backendHost,
            changeOrigin: true,
            // v3 ใช้ function แทน string เพราะ string จะ match exact path เท่านั้น ไม่ใช่ prefix
            pathFilter: (pathname) => pathname.startsWith(`/api/${backendPrefix}`),
        })
    );
};
