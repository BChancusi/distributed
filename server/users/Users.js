const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');


router.route("/")
    .get((req, res) => {

        pool.query('SELECT username, id FROM users', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    })
    .post((req, res) => {

        pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], function (error, results) {
            if (error) throw error;

            if (results.length > 0) {
                res.send({express: "username exists"})
            }

            bcrypt.hash(req.query.password, 8, function (error, hash) {
                if (error) throw error;

                pool.query(`INSERT INTO users (username, password) VALUES(? , ?) `,
                    [req.query.username, hash], function (error, results) {
                        if (error) throw error;

                        res.send({express: {username : req.query.username, id: results.insertId}})
                });
            });
        });
    });

router.post('/signin', (req, res) => {

    pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], function (error, results) {
        if (error) throw error;

        if (results.length === 0) {
            res.send({express: "details incorrect"})
        }

        bcrypt.compare(req.query.password, results[0].password)
            .then((boolean) => {
                if(!boolean){
                    res.send({express: "details incorrect"})
                }

                res.send({express: "details correct"})
            });
    });
});

router.delete('/users/:userId', (req) => {

    pool.query(`DELETE FROM users WHERE username = ?`, [req.body.username], function (error) {
        if (error) throw error;
    });
});

module.exports = router;

