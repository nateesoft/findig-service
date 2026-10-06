module.exports = {
  apps: [
    {
      name: "realtime-web",
      script: "server.js",
      env: {
        PORT: 3008,
        // URL prefix served by server.js - must match PUBLIC_URL / REACT_APP_BASENAME in .env
        APP_PREFIX: "realtime-web",
        BACKEND_PREFIX: "realtime-service",
        BACKEND_HOST: "http://127.0.0.1:9090",
        REACT_APP_SERVICE_HOST: "/api/realtime-service",
        REACT_APP_API_USER: "admin",
        REACT_APP_API_KEY: "supersecret",
        // Reference only: PUBLIC_URL / REACT_APP_* are read at build time from .env,
        // changing them here has no effect until you update .env and rebuild
        PUBLIC_URL: "/realtime-web",
        REACT_APP_BASENAME: "/realtime-web"
      }
    }
  ]
}
