const mysql = require('mysql');

const dbConfig = {
    host: 'localhost' || process.env.MYSQL_HOST,
    user: 'root' || process.env.MYSQL_USER,
    password: '#Inspiron17' || process.env.MYSQL_PASSWORD,
    database: 'instagram' || process.env.MYSQL_DATABASE,
  };
  

// Create a connection pool
const con = mysql.createConnection(dbConfig);

module.exports = { 
    mysql, con 
};