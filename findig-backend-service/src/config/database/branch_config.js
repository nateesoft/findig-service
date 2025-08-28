module.exports = [
  {
    code: 'PRODUCTION',
    name: 'Stock Realtime 909',
    driver: 'mysql',
    databases: {
      pos: {
        host: '183.88.210.11',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyRetail652findigColo',
        port: '3326'
      },
      crm: {
        host: '183.88.210.11',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyCrmBranch',
        port: '3326'
      },
      bor: {
        host: '183.88.210.11',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyBorLocal',
        port: '3326'
      }
    }
  },
  {
    code: 'DEVELOPMENT',
    name: 'TEST Stock Realtime',
    driver: 'mysql2',
    databases: {
      pos: {
        host: 'localhost',
        user: 'root',
        password: 'nathee2024',
        database: 'MyPOS',
        port: '3306'
      },
      crm: {
        host: 'localhost',
        user: 'root',
        password: 'nathee2024',
        database: 'mycrmbranch',
        port: '3306'
      },
      bor: {
        host: 'localhost',
        user: 'root',
        password: 'nathee2024',
        database: 'MyBorLocal',
        port: '3306'
      }
    }
  }
];
