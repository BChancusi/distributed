const mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
    module.exports = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
}else{
    const config = require('./config');

    const connection = mysql.createPool({
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