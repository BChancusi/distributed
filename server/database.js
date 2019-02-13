const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit : 10,
    host     : process.env.DATABASE_URL,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_DATABASE,
});

connection.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

module.exports = connection;