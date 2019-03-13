const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');


router.get('/', (req, res) => {

    pool.query('SELECT username, id FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

// router.get('/:userId', (req, res) => {
//
//     pool.query('SELECT username, id FROM users', function (error, results) {
//         if (error) throw error;
//
//         res.send({express: results});
//     });
// });

router.post('/signup', (req, res) => {

    pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], function (error, results) {
        if (error) throw error;

        if (results.length > 0) {

            bcrypt.hash(req.query.password, 8, function (error, hash) {
                if (error) throw error;

                pool.query(`INSERT INTO users (username, password) VALUES(? , ?) `, [req.query.username, hash], function (error) {
                    if (error) throw error;
                    res.send({express: "account created"})
                });
            });
        } else {
            res.send({express: "username exists"})
        }
    });
});

router.post('/signin', (req, res) => {

    pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], function (error, results) {
        if (error) throw error;

        if (results.length > 0) {

            bcrypt.compare(req.query.password, results[0].password).then((compare) => {
                if (compare) {
                    res.send({express: "details correct"})
                } else {
                    res.send({express: "details incorrect"})
                }
            });
        } else {
            res.send({express: "details incorrect"})
        }
    });
});

router.delete('/users/:userId', (req) => {

    pool.query(`DELETE FROM users WHERE username = ?`, [req.body.username], function (error) {
        if (error) throw error;
    });
});

module.exports = router;

