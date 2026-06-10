module.exports = {
  apps: [
    {
      name: "realtime-web",
      script: "server.js",
      env: {
        PORT: 3008,
        APP_PREFIX: "realtime-web",
        BACKEND_PREFIX: "realtime-service",
        BACKEND_HOST: "http://127.0.0.1:9090"
      }
    }
  ]
}
