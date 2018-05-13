const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pmnew',
    password: '123456',
    port: 5432,
});

module.exports = pool