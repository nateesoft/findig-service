module.exports = {
  apps: [
    {
      name: "findig-sale-online",
      script: "server.js",
      env: {
        WEB_PORT: 3000,
        SERVICE_HOST: "http://127.0.0.1:9090"
      }
    }
  ]
}
