const mysql = require('mysql');

let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
        user: 'ufk4d4narvb0tavn',
        password: 'XU9lekbFRYrbXsOVCY79',
        database: 'bycyqzbdadxwtqtuvaoa'
    });

    // Conectar a la base de datos
    db.connect(function(err) {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Esperar antes de intentar reconectar
        } else {
            console.log('DATABASE CONNECTED!');
        }
    });

    // Manejar errores de conexión
    db.on('error', function(err) {
        console.error('Error en la conexión:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Conexión perdida. Intentando reconectar...');
            handleDisconnect(); // Reconectar automáticamente
        } else {
            throw err; // Manejar errores diferentes
        }
    });
}

// Inicializar la conexión
handleDisconnect();

module.exports = db;
