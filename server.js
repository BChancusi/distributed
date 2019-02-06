
const app = require('./app');

const port = process.env.PORT || 5000;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
//
// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Http server closed.');
//
//         connection.end(function (error) {
//             // all connections in the pool have ended
//             if (error) throw error;
//             console.log('MYSQL connection closed.');
//         });
//     });
// });

// app.get('/files', (req, res) => {
//     res.send({express: Object.values(reports)});
// });
//
// app.get('/file:id', (req, res) => {
//     res.send({express: Object.values(reports)});
// });