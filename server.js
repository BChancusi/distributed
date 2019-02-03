const express = require('express');
const config = require('./config.js');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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

app.get('/files', (req, res) => {

    connection.query('SELECT * FROM files', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

app.post('/files', (req) => {

    connection.query(`INSERT INTO files SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/files', (req) => {

    connection.query(`DELETE FROM files WHERE title = ?`, [req.body.title], function (error) {
        if (error) throw error;
    });
});


app.get('/reports', (req, res) => {

    connection.query('SELECT * FROM reports', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

app.post('/reports', (req) => {

    connection.query(`INSERT INTO reports SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/reports', (req) => {

    connection.query(`DELETE FROM reports WHERE title = ?`, [req.body.title], function (error) {
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

    bcrypt.hash(req.body.password, 8, function(error, hash) {
        if(error) throw error;

        req.body.password = hash;

        connection.query(`INSERT INTO users SET ?`, req.body , function (error) {
            if (error) throw error;
        });

        // bcrypt.compare(oldPass, hash).then((res) => {
        //     console.debug(res);
        // });
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