const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

import './database.js';


let reports = {
    1: {
        id: '1',
        title: '2019 report primary',
        status: 'Completed',
        editable: 'true',
        hash: '#123asd',
        lastEdited: "30/01/2019"
    },
    2: {
        id: '2',
        title: '2018 report primary',
        status: 'Completed',
        editable: 'false',
        hash: '#123asd',
        lastEdited: "30/01/2019"
    },

    3:{
        id: '1',
        title: '2017 report primary',
        status: 'Completed',
        editable: 'false',
        hash: '#123asd',
        lastEdited: "30/01/2019"
    }

};

app.get('/reports', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.get('/files', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.get('/file:id', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.get('/users', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.get('/user:id', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.post('/api/world', (req, res) => {
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

