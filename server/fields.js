const express = require('express');
const router = express.Router();
const connection = require('./database');


router.route('/:fileId').get((req, res) => {

    connection.query('SELECT * FROM fields WHERE file_Id = ?', [req.params.fileId], function (error, results) {
        if (error) throw error;

        res.send({express: results});
    });

}).put((req, res) => {

    connection.query(`UPDATE fields SET ?  WHERE id = ?`, [req.body, req.params.fieldId], function (error) {
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

    promise.then(query => {

        connection.query('SELECT * FROM fields WHERE file_Id IN (?)', [query], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    });
});

router.post('/', (req, res) => {

    connection.query(`INSERT INTO fields SET ?`, [req.body], function (error, results) {
        if (error) throw error;

        connection.query('SELECT * FROM fields WHERE id = ?', [results.insertId], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    });
});

router.post('/branch/:branchTitle', (req, res) => {

    let query = [];

    for (let i = 0; i < req.body.length - 1; i++) {


        delete req.body[i].timestamp;
        delete req.body[i].id;
        req.body[i].version_id = req.body[i].version_id + 1;
        req.body[i].branch_title = req.params.branchTitle;


        query.push(Object.values(req.body[i]));

    }
    const fileValue = req.body[req.body.length - 1];
    delete fileValue.timestamp;
    delete fileValue.id;

    fileValue.branch_title = req.params.branchTitle;

        connection.query(`INSERT INTO files SET ?`, [fileValue] , function (error, results) {
            if (error) throw error;

            connection.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), query], function (error, results) {
                if (error) throw error;

                res.sendStatus(200)

            });
        });
});

module.exports = router;