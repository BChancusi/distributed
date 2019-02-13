const express = require('express');
const router = express.Router();
const connection = require('./database');


router.get('/', (req, res) => {

    connection.query('SELECT * FROM files', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

router.get('/:reportId', (req, res) => {

    connection.query(`SELECT * FROM files WHERE report_Id = ?`,[req.params.reportId],  function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

router.post('/', (req, res) => {

    connection.query(`INSERT INTO files SET ?`, req.body , function (error, results) {
        if (error) throw error;
    });

    res.send({express: res.results});
});

router.delete('/:fileId', (req, res) => {

    connection.query(`DELETE FROM files WHERE id =?`, [req.params.fileId], function (error, results) {
        if (error) throw error;

        res.send({express: res.results});
    });
});

router.put('/:fileId', (req, res) => {

    connection.query(`UPDATE files SET ?  WHERE id = ?`, [req.body, req.params.fileId] , function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
});

module.exports = router;