const mysql = require('mysql');

let db; // Cambiamos el nombre a 'db'

function handleDisconnect() {
    db = mysql.createConnection({
        host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
        user: 'ufk4d4narvb0tavn',
        password: 'XU9lekbFRYrbXsOVCY79',
        database: 'bycyqzbdadxwtqtuvaoa',
    });

    db.connect(err => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Reintento después de 2 segundos
        } else {
            console.log('¡Connected MYSQL!');
        }
    });

    db.on('error', err => {
        console.error('Error en la conexión:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Disconnected MySQL...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

// Inicia la conexión
handleDisconnect();

// Exporta la conexión como 'db'
module.exports = db;
