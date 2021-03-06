const express = require('express');
const router = express.Router();
const pool = require('../database');
const format = require('date-fns/format');

router.route('/')
    .get((req, res) => {

        pool.query('SELECT * FROM reports WHERE permission <= ? ', req.user.permission, function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    })
    .post((req, res) => {

        if (req.body.title.length > 50) {
            return res.send({express: "length exceeds 50"})
        }

        pool.query(`SELECT * FROM reports WHERE title = ?`, req.body.title, function (error, results) {
            if (error) throw error;

            if (results.length > 0) {
                return res.send({express: "already exists"})
            }

            req.body.timestamp = format(
                new Date(),
                'YYYY-MM-DD HH:mm:ss'
            );
            pool.query(`INSERT INTO reports SET ?`, req.body, function (error, results) {
                if (error) throw error;


                req.body.id = results.insertId;

                res.send({express: req.body});
            });

        });

    });

router.route('/:reportId')
    .delete((req, res) => {

        pool.query(`DELETE FROM reports WHERE id = ?`, req.params.reportId, function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
    }).put((req, res) => {

    if (req.body.title === "") {
        return res.sendStatus(409);
    }

    pool.query(`SELECT * FROM reports WHERE title = ?`, req.body.title, function (error, results) {
        if (error) throw error;

        if (results.length > 0) {
            return res.sendStatus(409);
        }

        pool.query(`UPDATE reports SET ?  WHERE id = ?`, [req.body, req.params.reportId], function (error) {
            if (error) throw error;


            res.sendStatus(200)
        });
    });

});

module.exports = router;