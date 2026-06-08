require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const backendHost = process.env.BACKEND_HOST || 'http://127.0.0.1:9090';
    const backendPrefix = process.env.BACKEND_PREFIX || 'findig-backend-service';
    app.use(
        createProxyMiddleware({
            target: backendHost,
            changeOrigin: true,
            pathFilter: `/api/${backendPrefix}`,
        })
    );
};
