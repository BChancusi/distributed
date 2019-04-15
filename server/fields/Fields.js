const express = require('express');
const router = express.Router();
const pool = require('../database');
const format = require('date-fns/format');
const isAuthenticated = require('../isAuthenticated.js');

router.use(isAuthenticated);

router.route('/:fileBranch')
    .delete((req, res) => {

        pool.query(`DELETE FROM fields WHERE id = ?`, req.params.fileBranch, function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });

    });


router.route('/')
    .post((req, res) => {

        pool.query(`SELECT * FROM fields WHERE title = ? AND branch_title = ? AND file_id = ?`,
            [req.body.title, req.body.branch_title, req.body.file_id], function (error, results) {
                if (error) throw error;

                if (results.length !== 0) {
                    return res.send({express: "already exists"})
                }

                pool.query(`INSERT INTO fields SET ?`, req.body, function (error, results) {
                    if (error) throw error;

                    pool.query('SELECT * FROM fields WHERE id = ?', results.insertId, function (error, results) {
                        if (error) throw error;

                        res.send({express: results});
                    });
                });

            });
    })
    .get((req, res) => {

        pool.query('SELECT * FROM fields WHERE branch_title = ? AND file_id =?', [req.query.branch_title, req.query.file_id], function (error, results) {
            if (error) throw error;

            pool.query('SELECT * FROM files WHERE title = ? AND report_id= ?', [req.query.title, req.query.report_id], function (error, resultsTitles) {
                if (error) throw error;

                res.send({fields: results, fileTitles: resultsTitles});
            });
        });

    })
    .put((req, res) => {


        if (req.body.length === 0) {
            return res.send({express: "no conflicts"});
        }

        let query = [];

        req.body.forEach(value => {

            query.push(value.id);
        });

        pool.query(`SELECT * FROM fields WHERE id IN (?)`, query, function (error, results) {
            if (error) throw error;


            let conflictsNew = [];
            let conflictsOld = [];
            let sourceMap = new Map();
            let deleteIds = [];

            req.body.forEach((value, index) => {

                sourceMap.set(value.title, index)
            });

            results.forEach(value => {

                const sourceGet = sourceMap.get(value.title);


                if (sourceGet !== undefined) {

                    if (req.body[sourceGet].id === value.id
                        && JSON.stringify(value.timestamp) !== req.body[sourceGet].timestamp
                        && value.value !== parseFloat(req.body[sourceGet].value)) {

                        conflictsNew.push(req.body[sourceGet]);
                        conflictsOld.push(value);
                    } else if (req.body[sourceGet].value === value.value) {

                        deleteIds.push(req.body[sourceGet].id)
                    }
                }
            });

            if (conflictsNew.length > 0 && conflictsOld.length > 0) {
               return res.send({conflictsNew: conflictsNew, conflictsOld: conflictsOld});

            }

            req.body = req.body.filter(value => {

                let boolean = true;
                for (let i = 0; i < deleteIds.length; i++) {
                    if (value.id === deleteIds[i]) {
                        boolean = false;
                        break;
                    }
                }

                return boolean;
            });

            req.body.forEach(value => {

                value.timestamp = format(
                    new Date(),
                    'YYYY-MM-DD HH:mm:ss'
                );

                pool.query(`UPDATE fields SET ?  WHERE id = ?`, [value, value.id], function (error) {
                    if (error) throw error;

                });
            });

            res.send({express: "no conflicts"});

        });
    });

router.post('/branch/:branchTitle', (req, res) => {


    const fileValue = req.body.pop();
    delete fileValue.timestamp;
    delete fileValue.id;
    fileValue.branch_title = req.params.branchTitle;

    pool.query(`SELECT * FROM files WHERE title = ? AND report_id = ? AND branch_title = ?`, [fileValue.title, fileValue.report_id, fileValue.branch_title], function (error, results) {
        if (error) throw error;

        if (results.length > 0) {
            return res.send({express: "already exists"});
        }

        pool.query(`INSERT INTO files SET ?`, fileValue, function (error, results) {
            if (error) throw error;

            if (req.body.length > 0) {

                let query = [];

                req.body.forEach(value => {

                    delete value.timestamp;
                    delete value.id;
                    value.branch_title = req.params.branchTitle;

                    query.push(Object.values(value));
                });

                pool.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), query], function (error) {
                    if (error) throw error;

                    pool.query(`SELECT * FROM files WHERE id= ?`, results.insertId, function (error, resultsSelect) {
                        if (error) throw error;

                        res.send({express: resultsSelect});
                    })

                });
            } else {
                pool.query(`SELECT * FROM files WHERE id= ?`, results.insertId, function (error, resultsSelect) {
                    if (error) throw error;

                    res.send({express: resultsSelect});
                })
            }
        });


    });
});

router.post('/mergeBranch/:mergeBranch', (req, res) => {

    if (req.body.length === 0) {
        return res.send({express: "no conflicts"});
    }

    pool.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.body[0].file_Id, req.params.mergeBranch], function (error, results) {
        if (error) throw error;

        let sourceMap = new Map();
        let conflictsSource = [];
        let conflictsTarget = [];
        let query = [];
        let deleteTitles = [];


        req.body.forEach((value, index) => {

            value.branch_title = req.params.mergeBranch;

            query.push(Object.values(value));

            sourceMap.set(value.title, index)

        });

        for (let i = 0; i < results.length; i++) {

            const sourceGet = sourceMap.get(results[i].title);

            if (sourceGet === undefined) {
                continue;
            }

            if (parseFloat(req.body[sourceGet].value) !== results[i].value) {

                conflictsSource.push(req.body[sourceGet]);
                conflictsTarget.push(results[i]);

            } else if (parseFloat(req.body[sourceGet].value) === results[i].value) {

                deleteTitles.push(req.body[sourceGet].title)
            }

        }

        if (conflictsTarget.length > 0 && conflictsSource.length > 0) {

            return res.send({conflictsSource: conflictsSource, conflictsTarget: conflictsTarget});

        }

        query = query.filter(value => {

            let boolean = true;
            for (let i = 0; i < deleteTitles.length; i++) {

                //value[3] is title index of value
                if (value[3] === deleteTitles[i]) {

                    boolean = false;
                    break;
                }
            }

            value.pop();
            value.shift();

            return boolean;
        });

        if (query.length > 0) {
            pool.query(`INSERT INTO fields (file_Id, branch_title, title, value) VALUES ?`, query, function (error) {
                if (error) throw error;

            });
        }

        res.send({express: "no conflicts"});


    });
});

router.post('/mergeResolved/:mergeBranch', (req, res) => {

    pool.query('SELECT * FROM fields WHERE file_Id = ? AND branch_title = ?', [req.body[0].file_Id, req.params.mergeBranch], function (error, results) {
        if (error) throw error;

        let resultsMap = new Map();
        let resolvedUpdate = [];
        let resolvedInsert = [];

        for (let i = 0; i < results.length; i++) {
            resultsMap.set(results[i].title, i)
        }

        for (let i = 0; i < req.body.length; i++) {

            const resultsGet = resultsMap.get(req.body[i].title);

            if (resultsGet !== undefined) {
                if (req.body[i].value !== results[resultsGet].value) {
                    resolvedUpdate.push(req.body[i]);
                }
            } else {
                resolvedInsert.push(Object.values(req.body[i]))
            }
        }

        if (resolvedInsert.length > 0) {

            pool.query(`INSERT INTO fields (??) VALUES ?`, [Object.keys(req.body[0]), resolvedInsert], function (error) {
                if (error) throw error;

            });
        }

        if (resolvedUpdate.length > 0) {

            resolvedUpdate.forEach(value => {

                value.timestamp = format(
                    new Date(),
                    'YYYY-MM-DD HH:mm:ss'
                );

                pool.query(`UPDATE fields SET ?  WHERE title = ? AND branch_title = ?`,
                    [value, value.title, value.branch_title], function (error) {
                        if (error) throw error;

                    });
            });
        }
    });


    res.sendStatus(200)

});

router.delete('/deleteBranch/query', (req, res) => {

        pool.query(`DELETE FROM files WHERE title = ? AND branch_title=?`, [req.query.title, req.query.branch_title], function (error) {
            if (error) throw error;

            res.sendStatus(200)
        });
});

router.put('/commitResolved', (req, res) => {

    req.body.forEach(value => {

        value.timestamp = format(
            new Date(),
            'YYYY-MM-DD HH:mm:ss'
        );
        pool.query(`UPDATE fields SET ?  WHERE id = ?`, [value, value.id], function (error) {
            if (error) throw error;

        });
    });

    res.sendStatus(200)
});


module.exports = router;

//TODO
// change new field saves from post on new field to post on save
// Field title change still matching id changes
// only push check on merge/commit if timestamps dont match#
// Only return actual conflicts, post/insert rest of fields??
// Data validation length
