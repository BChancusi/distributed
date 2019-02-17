const express = require('express');
const router = express.Router();
const connection = require('./database');


router.route('/')
    .get( (req, res) => {

    connection.query('SELECT * FROM files', function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

})
    .post( (req, res) => {

    connection.query(`INSERT INTO files SET ?`, req.body , function (error, results) {
        if (error) throw error;
    });

    res.send({express: res.results});
});
router.route('/:fileId')
    .delete( (req, res) => {

    connection.query(`DELETE FROM files WHERE id =?`, [req.params.fileId], function (error, results) {
        if (error) throw error;

        res.send({express: res.results});
    });
})
    .put( (req, res) => {

    connection.query(`UPDATE files SET ?  WHERE id = ?`, [req.body, req.params.fileId] , function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
});

router.get('/branch', (req, res) => {

    connection.query(`SELECT * FROM files WHERE report_Id = ? AND branch_title = ?`,[req.query.report_id, req.query.branch_title],  function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

});

module.exports = router;