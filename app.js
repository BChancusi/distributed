const express = require('express');
const config = require('./config.js');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dateFns = require('date-fns/format');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

app.get('/fields/:fileId', (req, res) => {

    connection.query(`SELECT * FROM fields WHERE fileId=${req.params.fileId}`, function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

app.post('/fields/:fileId', (req) => {

    connection.query(`INSERT INTO fields SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/fields/:fieldId', (req) => {

    connection.query(`DELETE FROM fields WHERE title = ?`, [req.body.title], function (error) {
        if (error) throw error;
    });
});


app.get('/files', (req, res) => {

    connection.query('SELECT * FROM files', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

app.get('/files/:reportId', (req, res) => {

    connection.query(`SELECT * FROM files WHERE report_Id=${req.params.reportId}`, function (error, results) {
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

    req.body.timestamp = dateFns(
        new Date(),
        'YYYY-MM-DD HH:mm:ss',
    );

    connection.query(`INSERT INTO reports SET ?`, req.body , function (error) {
        if (error) throw error;
    });
});

app.delete('/reports/:reportId', (req) => {

    connection.query(`DELETE FROM reports WHERE id =${req.params.reportId}`, function (error) {
        if (error) throw error;
    });
});

app.get('/users', (req, res) => {

    connection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

app.get('/users/:userId', (req, res) => {

    connection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

app.post('/users', (req) => {

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

app.delete('/users/:userId', (req) => {

    connection.query(`DELETE FROM users WHERE username = ?`, [req.body.username], function (error) {
        if (error) throw error;
    });
});

module.exports = app;
