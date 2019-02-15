const express = require('express');
const router = express.Router();
const connection = require('./database');


router.route('/:fileBranch')
    .get((req, res) => {

        const fileBranch = req.params.fileBranch;
        let queryBranch = fileBranch.split("+");


    connection.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [queryBranch[0], queryBranch[1]], function (error, results) {
        if (error) throw error;

        connection.query('SELECT branch_title, id FROM files WHERE title = ?', [queryBranch[2]], function (error, resultsTitles) {
            if (error) throw error;

            res.send({fields: results, fileTitles : resultsTitles});
        });
    });

}).put((req, res) => {

    connection.query(`UPDATE fields SET ?  WHERE id = ?`, [req.body, req.params.fileBranch], function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
}).delete((req, res) => {

    connection.query(`DELETE FROM fields WHERE id = ?`, [req.params.fileBranch], function (error, results) {
        if (error) throw error;

        res.send({express: res.results});
    });

});

router.get('/file/:fileIds', (req, res) => {

    let promise = new Promise((resolve, reject) => {

        const ids = req.params.fileIds;
        let queryIds = ids.split("+");

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

router.get('/mergeBranch/:mergeBranches', (req, res) => {

    const mergeBranches = req.params.mergeBranches;
    let queryBranches = mergeBranches.split("+");


    connection.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [queryBranches[0], queryBranches[1]], function (error, results) {
        if (error) throw error;

        connection.query('SELECT branch_title, id FROM files WHERE title = ?', [queryBranches[2]], function (error, resultsTitles) {
            if (error) throw error;

            res.send({fields: results, fileTitles: resultsTitles});
        });
    });
});
module.exports = router;