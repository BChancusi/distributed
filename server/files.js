const express = require('express');
const router = express.Router();
const pool = require('./database');


router.route('/')
    .get((req, res) => {

        pool.query('SELECT * FROM files', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    })
    .post((req, res) => {

        pool.query(`SELECT * FROM files WHERE title = ? AND report_id = ? `, [req.body.title, req.body.report_id], function (error, results) {
            if (error) throw error;

            if (results.length === 0) {

                pool.query(`INSERT INTO files SET ?`, req.body, function (error, results) {
                    if (error) throw error;

                    pool.query('SELECT * FROM files WHERE id = ?', [results.insertId], function (error, results) {
                        if (error) throw error;

                        res.send({express: results});
                    });
                });
            }else{
                res.send({express: "already exists"})
            }
        });
    });
router.route('/:fileId')
    .delete((req, res) => {

        pool.query(`DELETE FROM fields WHERE file_Id =?`, [req.params.fileId], function (error) {
            if (error) throw error;

            pool.query(`DELETE FROM files WHERE id =?`, [req.params.fileId], function (error) {
                if (error) throw error;

                res.sendStatus(200)
            });
        });
    })
    .put((req, res) => {

        pool.query(`UPDATE files SET ?  WHERE id = ?`, [req.body, req.params.fileId], function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
    });

router.get('/branch', (req, res) => {

    pool.query(`SELECT * FROM files WHERE report_Id = ? AND branch_title = ?`, [req.query.report_id, req.query.branch_title], function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

module.exports = router;