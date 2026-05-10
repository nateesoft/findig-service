module.exports = {
  apps: [
    {
      name: "findig-sale-online",
      script: "server.js",
      env: {
        PORT: 3333,
        BACKEND_HOST: "http://127.0.0.1:9090"
      }
    }
  ]
}
