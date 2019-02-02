const express = require('express');
const config = require('./config.js');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database,
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

app.get('/reports', (req, res) => {

    connection.query('SELECT * FROM files', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

app.post('/reports', (req) => {

    connection.query(`INSERT INTO files SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/reports', (req) => {

    connection.query(`DELETE FROM files WHERE title = ?`, [req.body.title], function (error) {
        if (error) throw error;
    });
});

app.get('/users', (req, res) => {

    connection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

app.get('/user:id', (req, res) => {

    console.log(req);
    console.log($(req.body.get));

    connection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

app.post('/user', (req) => {

    connection.query(`INSERT INTO users SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/user', (req) => {

    connection.query(`DELETE FROM users WHERE username = ?`, [req.body.username], function (error) {
        if (error) throw error;
    });
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// app.get('/files', (req, res) => {
//     res.send({express: Object.values(reports)});
// });
//
// app.get('/file:id', (req, res) => {
//     res.send({express: Object.values(reports)});
// });