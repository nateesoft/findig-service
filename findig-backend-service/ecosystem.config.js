module.exports = {
  apps: [
    {
      name: "findig-backend-service",
      script: "bin/www",
      env: {
        PORT: 9090,
        NODE_ENV: "production",
        WEB_USER_AUTH: "admin",
        WEB_USER_PASS: "supersecret",
        API_SECRET_PASS: "XkhZG4fW2t2W"
      }
    }
  ]
}
