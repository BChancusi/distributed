const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


let reports = {
    1: {
        id: '1',
        title: '2019 report primary',
        statue: 'Completed',
        editable: 'false',
        hash: '#123asd'
    }

};

app.get('/reports', (req, res) => {
    res.send({express: Object.values(reports)});
});

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

