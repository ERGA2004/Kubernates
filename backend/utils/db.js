const mysql = require('mysql2/promise');
require('dotenv').config({ override: false });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = {
    query: (sql, params) => pool.execute(sql, params),
};
