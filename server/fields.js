const express = require('express');
const router = express.Router();
const connection = require('./database');


router.route('/:fileBranch')
    .put((req, res) => {

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

        const masterBranch = query.pop();

        connection.query('SELECT * FROM fields WHERE file_Id IN (?) AND branch_title = ?', [query, masterBranch], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    });
});

router.route('/')
    .post((req, res) => {

        connection.query(`INSERT INTO fields SET ?`, [req.body], function (error, results) {
            if (error) throw error;

            connection.query('SELECT * FROM fields WHERE id = ?', [results.insertId], function (error, results) {
                if (error) throw error;

                res.send({express: results});
            });
        })
    })
    .get((req, res) => {

        connection.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.query.file_id, req.query.branch_title], function (error, results) {
            if (error) throw error;

            connection.query('SELECT branch_title, id FROM files WHERE title = ?', [req.query.title], function (error, resultsTitles) {
                if (error) throw error;

                res.send({fields: results, fileTitles : resultsTitles});
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

    connection.query(`INSERT INTO files SET ?`, [fileValue], function (error, results) {
        if (error) throw error;

        connection.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), query], function (error, results) {
            if (error) throw error;

            res.sendStatus(200)

        });
    });
});

router.post('/mergeBranch/:mergeBranch', (req, res) => {

    connection.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.body[0].file_Id, req.params.mergeBranch], function (error, results) {
        if (error) throw error;

        let conflicts = [];

        for(let i = 0; i < results.length; i++){
            for(let j = 0; j < req.body.length; j++){
                    if(results[i].title === req.body[j].title){
                        conflicts.push(results[i]);
                        break;
                    }
            }
        }

        res.send({express: conflicts});


    });
});
module.exports = router;