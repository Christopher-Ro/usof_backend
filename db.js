const mysql = require("mysql2");
const config = require('./config.json');

const pool = mysql.createConnection(config);

pool.connect((err)=>{
    if (err) {
        return console.error("Error: " + err.message);
    }
});

module.exports = pool
