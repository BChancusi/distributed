const express = require('express');
const router = express.Router();
const connection = require('./database');


router.route('/')
    .get((req, res) => {

        connection.query('SELECT * FROM reports', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    })
    .post((req, res) => {

        connection.query(`INSERT INTO reports SET ?`, req.body, function (error, results) {
            if (error) throw error;

            res.send({express: res.results});

        });
    });

router.route('/:reportId')
    .delete((req, res) => {

        connection.query(`DELETE FROM reports WHERE id = ?`, [req.params.reportId], function (error, results) {
            if (error) throw error;

            res.send({express: res.results});
        });
    })
    .put((req, res) => {

        connection.query(`UPDATE reports SET ?  WHERE id = ?`, [req.body, req.params.reportId], function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
    });

module.exports = router;