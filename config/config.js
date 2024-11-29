const mysql = require('mysql');

const dbConfig = {
    host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
    user: 'ufk4d4narvb0tavn',
    password: 'XU9lekbFRYrbXsOVCY79',
    database: 'bycyqzbdadxwtqtuvaoa'
};

let db;

function handleConnection() {
    db = mysql.createConnection(dbConfig);

    // Conectar a la base de datos
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            // Reintentar conexión tras 2 segundos
            setTimeout(handleConnection, 2000);
        } else {
            console.log('DATABASE CONNECTED!');
        }
    });

    // Manejo de errores de conexión
    db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to the database...');
            handleConnection(); // Reconectar automáticamente
        } else {
            throw err; // Para otros errores, lanzar la excepción
        }
    });
}

// Iniciar conexión
handleConnection();

module.exports = db;
