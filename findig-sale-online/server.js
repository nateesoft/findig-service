const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const BASENAME = "/findig-sale-online";
const PORT = process.env.PORT || 3000;
const BACKEND_HOST = process.env.BACKEND_HOST || 'http://127.0.0.1:9090';

// Proxy API requests to backend before serving static files
app.use(
    '/api/findig-backend-service',
    createProxyMiddleware({
        target: BACKEND_HOST,
        changeOrigin: true,
    })
);

// Serve static files from the React app
app.use(BASENAME, express.static(path.join(__dirname, 'build')));

app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
});

// Fallback for SPA: ส่ง index.html กลับในทุกเส้นทางที่ไม่พบไฟล์
app.get(`${BASENAME}/*`, (req, res) => {
  res.sendFile(express.static(path.join(__dirname, 'index.html')));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
