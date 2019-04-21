const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {

        pool.query(`SELECT * FROM users WHERE username = ?`, username, async function (error, results) {
            if (error) return done(error);

            if (results.length === 0) {
                return done(null, false);
            }

            const passwordCompare = await bcrypt.compare(password, results[0].password);

            if (!passwordCompare) {
                return done(null, false);
            }

            return done(null, results[0]);

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    pool.query('SELECT * FROM users WHERE id = ?', id, function (error, results) {
        if (error) throw error;

        done(error, results[0]);
    });
});

function isAuthenticatedAdmin(req, res, next) {
    if (!req.isAuthenticated() || req.user.permission < 5) {
        return res.status(403).send({express: "not authenticated"})
    }

    next()
}

router.route("/")
    .get(isAuthenticatedAdmin, (req, res) => {

        pool.query('SELECT username, id, permission FROM users ORDER BY permission DESC', function (error, results) {
            if (error) throw error;

            res.send({express: results});
        });
    })
    .post(isAuthenticatedAdmin, (req, res) => {

        if (req.query.permission === 5) {
            return res.send({express: "permission can not be 5"})
        }

        pool.query(`SELECT * FROM users WHERE username = ?`, req.query.username, async function (error, results) {
            if (error) throw error;

            if (results.length > 0) {
                return res.send({express: "username exists"})
            }

            const hash = await bcrypt.hash(req.query.password, 8);

            pool.query(`INSERT INTO users (username, password, permission) VALUES(? , ? , ?) `,
                [req.query.username, hash, req.query.permission], function (error, results) {
                    if (error) throw error;

                    res.send({
                        express: {
                            username: req.query.username,
                            permission: req.query.permission,
                            id: results.insertId
                        }
                    })
                });
        });
    });

router.delete('/:userId', isAuthenticatedAdmin, (req, res) => {

    pool.query(`DELETE FROM users WHERE id = ?`, req.params.userId, function (error) {
        if (error) throw error;

        res.sendStatus(200)
    });
});
router.post('/login', function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send({express: "details incorrect"})
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            return res.send({express: {id: req.user.id, username: req.user.username, permission: req.user.permission}});
        });
    })(req, res, next);
});



router.get('/logout', function (req, res) {
    req.logout();
    res.send({express: "logged out"});
});

module.exports = router;

