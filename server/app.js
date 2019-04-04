const express = require('express');
const reports = require('./reports/Reports');
const files = require('./files/Files');
const fields = require('./fields/Fields');
const users = require('./users/Users');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/API/reports', reports);
app.use('/API/files', files);
app.use('/API/fields', fields);
app.use('/API/users', users);

if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
    });
}


module.exports = app;

//TODO delete file is inconsistent with branches. Two different reports can have same names and if matching to id
//      branches wont match.