const express = require('express');
const router = express.Router();
const pool = require('../database');
const isAuthenticated = require('../isAuthenticated.js');

router.use(isAuthenticated);

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

            if (results.length > 0) {
                return res.send({express: "already exists"})
            }

            pool.query(`INSERT INTO files SET ?`, req.body, function (error, results) {
                if (error) throw error;

                pool.query('SELECT * FROM files WHERE id = ?', results.insertId, function (error, results) {
                    if (error) throw error;

                    res.send({express: results});
                });
            });
        });
    });
router.route('/:fileId')
    .delete((req, res) => {

        pool.query(`DELETE FROM files WHERE id =?`, req.params.fileId, function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });

        //TODO doesnt delete new branch as on different id
    })
    .put((req, res) => {

        pool.query(`UPDATE files SET ?  WHERE id = ?`, [req.body, req.params.fileId], function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
    });

router.get('/branch', (req, res) => {

    pool.query(`SELECT * FROM files WHERE report_Id = ? AND branch_title = 'master'`, req.query.report_id, async function (error, resultsFiles) {
        if (error) throw error;

        if(resultsFiles.length === 0){
            return res.send({data: {files: [], fields: []}})
        }
        const ids = await resultsFiles.map(value => {
            return value.id;
        });

        pool.query('SELECT * FROM fields WHERE file_Id IN (?) AND branch_title = "master" ORDER BY value DESC', ids, function (error, results) {
            if (error) throw error;

            res.send({data: {files: resultsFiles, fields: results}});
        });

    });
});

module.exports = router;