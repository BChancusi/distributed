const mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
    module.exports = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
}else{

    require('dotenv').config();

    const connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    connection.on('acquire', function (connection) {
        console.log('Connection %d acquired', connection.threadId);
    });

    module.exports = connection;

}