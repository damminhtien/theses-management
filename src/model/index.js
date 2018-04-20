const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pm',
    password: '123456',
    port: 5432,
});

module.exports = pool;