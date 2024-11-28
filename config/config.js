const mysql = require('mysql');

let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
        user: 'ufk4d4narvb0tavn',
        password: 'XU9lekbFRYrbXsOVCY79',
        database: 'bycyqzbdadxwtqtuvaoa',
    });

    connection.connect(err => {
        if (err) {
            console.error('Error al reconectar:', err);
            setTimeout(handleDisconnect, 2000); // Reintento después de 2 segundos
        } else {
            console.log('Conexión establecida con MySQL');
        }
    });

    connection.on('error', err => {
        console.error('Error en la conexión:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
