const mysql = require('mysql');
const util = require('util');

let pool = mysql.createPool({
  connectionLimit: process.env.DB_POOL_SIZE ? process.env.DB_POOL_SIZE : 10,
  host: process.env.DB_HOSTNAME ? process.env.DB_HOSTNAME : '89.117.188.103',
  user: process.env.DB_USER ? process.env.DB_USER : 'u605326525_finmate_dev',
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '7Em@!9bJo',
  database: process.env.DB_DATABASE ? process.env.DB_DATABASE : 'u605326525_finmate_dev',
  port: process.env.DB_PORT ? process.env.DB_PORT : 3306,
});

// Get connection from pool
const getDbConnection = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

// Return connection to pool
const closeDbConnection = connection => {
  return new Promise((resolve, reject) => {
    try {
      if (connection) {
        connection.release();
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// get connection promise
const getConnectionPromise = async connection => {
  return new Promise((resolve, reject) => {
    try {
      let connectionPromise = util.promisify(connection.query).bind(connection);
      let connectionTransaction = util
        .promisify(connection.beginTransaction)
        .bind(connection);
      let connectionRollback = util
        .promisify(connection.rollback)
        .bind(connection);
      let connectionCommit = util.promisify(connection.commit).bind(connection);
      resolve({
        connectionPromise,
        connectionTransaction,
        connectionRollback,
        connectionCommit,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getDbConnection, closeDbConnection, getConnectionPromise };
