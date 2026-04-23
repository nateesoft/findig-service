/**
 * Migration: add discount_amount column to draft_sale and draft_sale_details
 *
 * Usage:
 *   npm run migrate              (DEVELOPMENT)
 *   npm run migrate PRODUCTION
 *   npm run migrate TEST
 *   npm run migrate ALL
 */

const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const util = require('util');

const branchConfig = require('../src/config/database/branch_config');

const MIGRATIONS = [
  {
    table: 'draft_sale',
    column: 'discount_amount',
    sql: `ALTER TABLE draft_sale ADD COLUMN discount_amount decimal(10,2) NOT NULL DEFAULT 0.00`
  },
  {
    table: 'draft_sale_details',
    column: 'discount_amount',
    sql: `ALTER TABLE draft_sale_details ADD COLUMN discount_amount decimal(10,2) NOT NULL DEFAULT 0.00`
  }
];

const checkColumnExists = async (queryFn, database, table, column) => {
  const rows = await queryFn(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [database, table, column]
  );
  return rows[0].cnt > 0;
};

const runMigration = async (envCode) => {
  const config = branchConfig.find(b => b.code === envCode);
  if (!config) {
    console.error(`  [ERROR] Environment "${envCode}" not found in branch_config`);
    return;
  }

  const dbConf = config.databases.pos;
  const { database } = dbConf;

  console.log(`\n[${envCode}] ${dbConf.host}:${dbConf.port}/${database}`);

  let queryFn;
  let end;

  if (config.driver === 'mysql') {
    const conn = mysql.createConnection(dbConf);
    await new Promise((resolve, reject) =>
      conn.connect(err => (err ? reject(err) : resolve()))
    );
    const q = util.promisify(conn.query.bind(conn));
    queryFn = (sql, params) => q(sql, params);
    end = () => new Promise(resolve => conn.end(resolve));
  } else {
    const conn = await mysql2.createConnection(dbConf);
    queryFn = async (sql, params) => {
      const [rows] = await conn.query(sql, params);
      return rows;
    };
    end = () => conn.end();
  }

  try {
    for (const { table, column, sql } of MIGRATIONS) {
      const exists = await checkColumnExists(queryFn, database, table, column);
      if (exists) {
        console.log(`  ✓  ${table}.${column} — already exists, skip`);
      } else {
        await queryFn(sql);
        console.log(`  +  ${table}.${column} — added`);
      }
    }
  } finally {
    await end();
  }
};

const main = async () => {
  const envArg = (process.argv[2] || 'DEVELOPMENT').toUpperCase();
  const targets = envArg === 'ALL'
    ? branchConfig.map(b => b.code)
    : [envArg];

  for (const env of targets) {
    try {
      await runMigration(env);
    } catch (err) {
      console.error(`  [ERROR] ${env}:`, err.message);
    }
  }

  console.log('\nDone.');
  process.exit(0);
};

main();
