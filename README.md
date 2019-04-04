# Distributed Budgeting System

Web application designed to allow multiple users to input financial data concurrently leverging branches and committing. 

## Getting Started

### Prerequisites

```
MySQL, Node.js.
```

### Installing

Create database tables

![MySQL database diagram](https://i.imgur.com/i6paw9X.png)

Inside server/database.js change database config to match correct credentials

```
    const connection = mysql.createPool({
        host     : host,
        user     : user,
        password : password,
        database : database,
    });
```


Inside main project folder run npm client-install.

```
npm run client-install
```

Run both server and client enviroments

```
npm run dev
```

Running application

![Image of running application](https://i.imgur.com/8qfyiT0.png)



## Running the tests
```
npm run test
```
