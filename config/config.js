const mysql = require('mysql');
const dbConfig = {
  host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
  user: 'ufk4d4narvb0tavn',
  password: 'XU9lekbFRYrbXsOVCY79',
  database: 'bycyqzbdadxwtqtuvaoa'
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig); // Recrear la conexión

  db.connect(function(err) {
    if (err) {
      console.error('error connecting to db: ' + err.stack);
      setTimeout(handleDisconnect, 2000); // Esperar 2 segundos antes de intentar nuevamente
    } else {
      console.log('connected to db');
    }
  });

  db.on('error', function(err) {
    console.log('DB error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Si se pierde la conexión, reconectar
    } else {
      throw err; // Otros errores
    }
  });
}

handleDisconnect(); // Iniciar la conexión
module.exports = db;