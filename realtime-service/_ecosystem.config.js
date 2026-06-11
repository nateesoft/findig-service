module.exports = {
  apps: [
    {
      name: "realtime-service",
      script: "bin/www",
      env: {
        PORT: 9090,
        APP_PREFIX: "realtime-service",
        NODE_ENV: "production",
        dbConfig: "PRODUCTION",
        WEB_USER_AUTH: "",
        WEB_USER_PASS: "",
        API_SECRET_PASS: "",
        DB_HOST: "",
        DB_PORT: "3306",
        DB_USER: "",
        DB_PASS: "",
        DB_DRIVER: "mysql2",
        DB_APP_NAME: "Stock Realtime",
        DB_POS_NAME: "MyRetail652findigColo",
        DB_CRM_NAME: "MyCrmBranch",
        DB_BOR_NAME: "MyBorLocal",
        MYSQLDUMP_PATH: ""
      }
    }
  ]
}
