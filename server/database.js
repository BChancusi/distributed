const mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
    module.exports = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
}else{

    require('dotenv').config();

    module.exports = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

}