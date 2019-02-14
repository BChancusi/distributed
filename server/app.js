const express = require('express');
const bodyParser = require('body-parser');
const reports = require('./reports');
const files = require('./files');
const fields = require('./fields');
const users = require('./users');

const path = require('path');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));

    // Express serve up index.html file if it doesn't recognize route
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.use(express.static(__dirname));

console.debug(__dirname);

app.use('/reports', reports);
app.use('/files', files);
app.use('/fields', fields);
app.use('/users', users);


module.exports = app;