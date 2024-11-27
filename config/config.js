const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
    user: 'ufk4d4narvb0tavn',
    password: 'XU9lekbFRYrbXsOVCY79',
    database: 'bycyqzbdadxwtqtuvaoa',
    connectionLimit: 10, // Número máximo de conexiones en el pool
    waitForConnections: true,
    queueLimit: 0, // Sin límite de cola de conexiones
});

pool.on('acquire', function (connection) {
    console.log('Conexión adquirida con ID:', connection.threadId);
});

pool.on('error', function (err) {
    console.error('Error en el pool de conexiones:', err);
});

module.exports = pool;
