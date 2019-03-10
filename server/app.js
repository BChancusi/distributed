const express = require('express');
const reports = require('./reports');
const files = require('./files');
const fields = require('./fields');
const users = require('./users');
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