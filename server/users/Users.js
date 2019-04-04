const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');


router.route("/")
    .get((req, res) => {

        pool.query('SELECT username, id, permission FROM users ORDER BY permission DESC', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    })
    .post((req, res) => {

        if (req.query.permission === 5) {
            return res.send({express: "permission can not be 5"})
        }

        pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], function (error, results) {
            if (error) throw error;

            if (results.length > 0) {
                return res.send({express: "username exists"})
            }

            bcrypt.hash(req.query.password, 8, function (error, hash) {
                if (error) throw error;

                pool.query(`INSERT INTO users (username, password, permission) VALUES(? , ? , ?) `,
                    [req.query.username, hash, req.query.permission], function (error, results) {
                        if (error) throw error;

                        res.send({
                            express: {
                                username: req.query.username,
                                permission: req.query.permission,
                                id: results.insertId
                            }
                        })
                    });
            });
        });
    });

router.post('/signin', (req, res) => {

    pool.query(`SELECT * FROM users WHERE username = ?`, [req.query.username], async function (error, results) {
        if (error) throw error;

        if (results.length === 0) {
            return res.send({express: "details incorrect"})
        }

        const passwordCompare = await bcrypt.compare(req.query.password, results[0].password);

        if (!passwordCompare) {
            return res.send({express: "details incorrect"})
        }

        res.send({
            express: {
                username: results[0].username,
                permission: results[0].permission,
                id: results[0].id
            }
        })

    });
});

router.delete('/:userId', (req, res) => {

    pool.query(`DELETE FROM users WHERE id = ?`, [req.params.userId], function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
});

module.exports = router;

