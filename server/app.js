const express = require('express');
const reports = require('./reports/Reports');
const files = require('./files/Files');
const fields = require('./fields/Fields');
const users = require('./users/Users');
const path = require('path');
const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const isAuthenticated = require('./isAuthenticated.js');
require('dotenv').config();

app.use(session({
    secret: process.env.SESSION_PASSWORD,
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use('/API/users', users);

app.use(isAuthenticated);

app.use('/API/reports', reports);
app.use('/API/files', files);
app.use('/API/fields', fields);


if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
    });
}

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});


module.exports = app;

//TODO delete file is inconsistent with branches. Two different reports can have same names and if matching to id
//      branches wont match.