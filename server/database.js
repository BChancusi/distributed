const mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
    const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

    module.exports = connection;
}else{
    const config = require('./config');

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

}