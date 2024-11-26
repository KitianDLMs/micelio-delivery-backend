const mysql = require('mysql');

const dbConfig = {
  host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
  user: 'ufk4d4narvb0tavn',
  password: 'XU9lekbFRYrbXsOVCY79',
  database: 'bycyqzbdadxwtqtuvaoa'
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig); // Crear una nueva conexión

  db.connect(err => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      setTimeout(handleDisconnect, 2000); // Reintentar después de 2 segundos
    } else {
      console.log('DATABASE CONNECTED!');
    }
  });

  // Manejar errores de la conexión
  db.on('error', err => {
    console.error('Error en la conexión:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconectar automáticamente si se pierde la conexión
    } else {
      throw err; // Para otros errores, lanzar excepción
    }
  });
}

handleDisconnect();

module.exports = db;
