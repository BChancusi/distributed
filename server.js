const app = require('./server/app');
const pool = require('./server/database');

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

process
    .on('SIGTERM', shutdown('SIGTERM'))
    .on('SIGINT', shutdown('SIGINT'))
    .on('uncaughtException', shutdown('uncaughtException'));

function shutdown(signal) {
    return (err) => {
        console.log(`${ signal }...`);
        if (err) console.error(err.stack || err);
        setTimeout(() => {
            server.close(() => {

                console.log("server closed");

                pool.end(function (err) {

                    console.log("pool closed");

                    process.exit(err ? 1 : 0);
                });
            });

        }, 5000).unref();
    };
}