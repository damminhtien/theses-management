const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pm',
    password: 'dmt',
    port: 2197
})

module.exports = pool