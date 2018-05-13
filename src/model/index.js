const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pmver2',
    password: '1412',
    port: 5432,
});

module.exports = pool