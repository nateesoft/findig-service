module.exports = {
  apps: [
    {
      name: "realtime-web",
      script: "server.js",
      env: {
        WEB_PORT: 3000,
        SERVICE_HOST: "http://127.0.0.1:9090"
      }
    }
  ]
}
