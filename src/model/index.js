const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pm',
<<<<<<< HEAD
    password: '1412',
=======
    password: '123456',
>>>>>>> ac9baf387e86360e3ee0280ee977737c36215490
    port: 5432,
});
module.exports = pool