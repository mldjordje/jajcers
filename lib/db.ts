import mysql from 'mysql2/promise';

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

export const isDatabaseConfigured = Boolean(dbHost && dbUser && dbPassword && dbName);

const pool = isDatabaseConfigured
    ? mysql.createPool({
          host: dbHost,
          user: dbUser,
          password: dbPassword,
          database: dbName,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
      })
    : ({
          query: async () => [[], []],
          getConnection: async () => {
              throw new Error('Database is not configured.');
          },
      } as unknown as mysql.Pool);

export default pool;
