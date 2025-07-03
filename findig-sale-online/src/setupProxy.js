require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const serviceHost = process.env.REACT_APP_SERVICE_HOST
    console.log('findig:',serviceHost)
    app.use(
        '/api',
        createProxyMiddleware({
            target: `${serviceHost}`,
            changeOrigin: true,
        })
    );
};
