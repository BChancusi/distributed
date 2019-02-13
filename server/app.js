const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const reports = require('./reports');
const files = require('./files');
const fields = require('./fields');
const users = require('./users');

const path = require('path');


const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    //
    app.get('/', (req, res) => {
        res.sendfile(path.join(__dirname = 'client/build/index.html'));
    })
}else{
    //build mode
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname+'/client/public/index.html'));
    });
}


app.use('/reports', reports);
app.use('/files', files);
app.use('/fields', fields);
app.use('/users', users);


module.exports = app;