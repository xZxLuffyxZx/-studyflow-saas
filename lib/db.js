import mysql from 'mysql2/promise';

const globalForMysql = globalThis;
export const pool = globalForMysql.studyflowPool ?? mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'studyflow',
  waitForConnections: true,
  connectionLimit: 10,
});
if (process.env.NODE_ENV !== 'production') globalForMysql.studyflowPool = pool;
