const express = require('express');
const router = express.Router();
const pool = require('./database');


router.route('/:fileBranch')
    .put((req, res) => {

        pool.query(`UPDATE fields SET ?  WHERE id = ?`, [req.body, req.params.fileBranch], function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
    }).delete((req, res) => {

    pool.query(`DELETE FROM fields WHERE id = ?`, [req.params.fileBranch], function (error, results) {
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

        pool.query('SELECT * FROM fields WHERE file_Id IN (?) AND branch_title = ?', [query, masterBranch], function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });

    });
});

router.route('/')
    .post((req, res) => {

        pool.query(`INSERT INTO fields SET ?`, [req.body], function (error, results) {
            if (error) throw error;

            pool.query('SELECT * FROM fields WHERE id = ?', [results.insertId], function (error, results) {
                if (error) throw error;

                res.send({express: results});
            });
        })
    })
    .get((req, res) => {

        pool.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.query.file_id, req.query.branch_title], function (error, results) {
            if (error) throw error;

            pool.query('SELECT branch_title, id FROM files WHERE title = ?', [req.query.title], function (error, resultsTitles) {
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

    pool.query(`INSERT INTO files SET ?`, [fileValue], function (error, results) {
        if (error) throw error;

        pool.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), query], function (error, results) {
            if (error) throw error;

            res.sendStatus(200)

        });
    });
});

router.post('/mergeBranch/:mergeBranch', (req, res) => {

    pool.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.body[0].file_Id, req.params.mergeBranch], function (error, results) {
        if (error) throw error;


        let sourceMap = new Map();
        let conflictsSource = [];
        let conflictsTarget = [];

        for(let i = 0; i < req.body.length; i++){
            sourceMap.set(req.body[i].title, i)
        }

        for(let i = 0; i < results.length; i++){

            const sourceGet = sourceMap.get(results[i].title);

            if(sourceGet !== undefined){
                if(req.body[sourceGet].value !== results[i].value){
                    conflictsSource.push(req.body[sourceGet]);
                    conflictsTarget.push(results[i]);
                }
            }
        }

        res.send({conflictsSource: conflictsSource, conflictsTarget: conflictsTarget});

    });
});

router.post('/mergeResolved/:mergeBranch', (req, res) => {

    pool.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.body[0].file_Id, req.params.mergeBranch], function (error, results) {
        if (error) throw error;

        let resultsMap = new Map();
        let resolvedUpdate = [];
        let resolvedInsert = [];


        for(let i = 0; i < results.length; i++){
            resultsMap.set(results[i].title, i)
        }

        for(let i = 0; i < req.body.length; i++){

            const resultsGet = resultsMap.get(req.body[i].title);

            if(resultsGet !== undefined){
                if(req.body[i].value !== results[resultsGet].value) {
                    resolvedUpdate.push(req.body[i]);
                }
            }else{
                resolvedInsert.push(Object.values(req.body[i]))
            }
        }

        pool.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), resolvedInsert], function (error) {
                 if (error) throw error;

                 resolvedUpdate.forEach(value => {
                     pool.query(`UPDATE fields SET ?  WHERE title = ? AND branch_title = ?`,
                         [value, value.title, value.branch_title], function (error) {
                         if (error) throw error;

                     });
                 });
        })
    });


    res.sendStatus(200)

});
module.exports = router;

// TODO serveal choices of resolving inserts - post resolved conflicts and use two selects and construct new fields
//      using body.
//      - branch titles will still need to be changed which can be done O(n)
//      - construct resolved fields client side and use single select followed by iterating checks for insert
//      - Old values will need to be deleted from target branch
//      - mergeBranchResolved[j].branch_title = mergeBranch doesnt work client side since constant value on useState