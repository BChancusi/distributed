const mysql = require('mysql');
const config = require('./config.js');

const connection = mysql.createPool({
    connectionLimit : 10,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database,
});

connection.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

module.exports = connection;