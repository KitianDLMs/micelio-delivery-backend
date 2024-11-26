const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
    user: 'ufk4d4narvb0tavn',
    password: 'XU9lekbFRYrbXsOVCY79',
    database: 'bycyqzbdadxwtqtuvaoa'
});

db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED!');
});

module.exports = db ;