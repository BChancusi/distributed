const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const reports = require('./reports');
const files = require('./files');
const fields = require('./fields');
const users = require('./users');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use('/reports', reports);
app.use('/files', files);
app.use('/fields', fields);
app.use('/users', users);


module.exports = app;
