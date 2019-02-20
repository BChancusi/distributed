const express = require('express');
const router = express.Router();
const pool = require('./database');


router.route('/')
    .get((req, res) => {

        pool.query('SELECT * FROM reports', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    })
    .post((req, res) => {

        pool.query(`INSERT INTO reports SET ?`, req.body, function (error, results) {
            if (error) throw error;

            pool.query('SELECT * FROM reports WHERE id = ?', [results.insertId], function (error, results) {
                if (error) throw error;

                res.send({express: results});
            });
        });
    });

router.route('/:reportId')
    .delete((req, res) => {

        pool.query(`DELETE FROM reports WHERE id = ?`, [req.params.reportId], function (error, results) {
            if (error) throw error;

            res.send({express: res.results});
        });
    })
    .put((req, res) => {

        pool.query(`UPDATE reports SET ?  WHERE id = ?`, [req.body, req.params.reportId], function (error, results, fields) {
            if (error) throw error;



            res.sendStatus(200)
        });
    });

module.exports = router;