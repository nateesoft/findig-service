module.exports = [
  {
    code: '001',
    name: 'สาขาทดสอบระบบ 001',
    databases: {
      pos: {
        host: 'findigrealtime.dyndns.biz',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyRetail652findigColo',
        port: '3326'
      },
      crm: {
        host: 'findigrealtime.dyndns.biz',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyCrmBranch',
        port: '3326'
      },
      bor: {
        host: 'findigrealtime.dyndns.biz',
        user: 'root',
        password: 'P@ssword!#',
        database: 'MyBorLocal',
        port: '3326'
      }
    }
  },
  {
    code: '002',
    name: 'สาขาทดสอบระบบ 002',
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
