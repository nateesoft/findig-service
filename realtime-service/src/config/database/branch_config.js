const dbConn = {
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  port:     process.env.DB_PORT || '3306',
};

module.exports = [
  {
    code:   process.env.dbConfig || 'PRODUCTION',
    name:   process.env.DB_APP_NAME || 'Stock Realtime',
    driver: process.env.DB_DRIVER  || 'mysql',
    databases: {
      pos: { ...dbConn, database: process.env.DB_POS_NAME },
      crm: { ...dbConn, database: process.env.DB_CRM_NAME },
      bor: { ...dbConn, database: process.env.DB_BOR_NAME },
    }
  }
];
