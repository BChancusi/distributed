const express = require('express');
const router = express.Router();
const pool = require('./database');
const bcrypt = require('bcryptjs');


router.get('/', (req, res) => {

    pool.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

router.get('/:userId', (req, res) => {

    pool.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });
});

router.post('/', (req) => {

    bcrypt.hash(req.body.password, 8, function(error, hash) {
        if(error) throw error;

        req.body.password = hash;

        pool.query(`INSERT INTO users SET ?`, [req.body] , function (error) {
            if (error) throw error;
        });

        // bcrypt.compare(oldPass, hash).then((res) => {
        //     console.debug(res);
        // });
    });
});

router.delete('/users/:userId', (req) => {

    pool.query(`DELETE FROM users WHERE username = ?`, [req.body.username], function (error) {
        if (error) throw error;
    });
});

module.exports = router;