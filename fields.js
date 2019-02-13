const express = require('express');
const router = express.Router();
const connection = require('./database');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// })

router.route('/:fileId').get( (req, res) => {

    connection.query('SELECT * FROM fields WHERE file_Id = ?', [req.params.fileId], function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

}).put( (req, res) => {

    connection.query(`UPDATE fields SET ?  WHERE id = ?`, [req.body, req.params.fieldId] , function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
}).delete((req, res) => {

    connection.query(`DELETE FROM fields WHERE id = ?`, [req.params.fieldId], function (error, results) {
        if (error) throw error;

        res.send({express: res.results});
    });

});

router.get('/file/:fileIds', (req, res) => {

    let promise = new Promise((resolve, reject) => {

        let queryIds;

        const ids = req.params.fileIds;
        queryIds = ids.split("+");

        resolve(queryIds)
    });

    promise.then(query =>{

        connection.query('SELECT * FROM fields WHERE file_Id IN (?)', [query], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    });
});

router.post('/', (req, res) => {

    connection.query(`INSERT INTO fields SET ?`, [req.body] , function (error, results) {
        if (error) throw error;

        connection.query('SELECT * FROM fields WHERE id = ?', [results.insertId], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    });
});

module.exports = router;