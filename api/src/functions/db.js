const sql = require('mssql');

const poolPromise = new sql.ConnectionPool(process.env.DB_CONNECTION_STRING)
  .connect()
  .then(pool => {
    console.log('Connected to Azure SQL');
    return pool;
  })
  .catch(err => {
    console.error('SQL connection error', err);
    throw err;
  });

module.exports = { sql, poolPromise };
