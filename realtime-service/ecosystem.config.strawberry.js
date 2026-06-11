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
        WEB_USER_AUTH: "admin",
        WEB_USER_PASS: "supersecret",
        API_SECRET_PASS: "XkhZG4fW2t2W",
        DB_HOST: "183.88.210.11",
        DB_PORT: "3326",
        DB_USER: "root",
        DB_PASS: "P@ssword!#",
        DB_DRIVER: "mysql",
        DB_APP_NAME: "Stock Realtime 909",
        DB_POS_NAME: "myRetail652StrawberryColo",
        DB_CRM_NAME: "MyCrmBranch",
        DB_BOR_NAME: "MyBorLocal",
        MYSQLDUMP_PATH: "D:\\MySQL5\\bin"
      }
    }
  ]
}
