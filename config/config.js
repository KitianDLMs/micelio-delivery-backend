const mysql = require('mysql');

class Database {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.connect(); // Iniciar conexión al instanciar
    }

    connect() {
        this.connection = mysql.createConnection(this.config);

        this.connection.connect((err) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err);
                setTimeout(() => this.connect(), 2000); // Intentar reconectar después de 2 segundos
            } else {
                console.log('Conexión a la base de datos establecida.');
            }
        });

        // Manejo de errores
        this.connection.on('error', (err) => {
            console.error('Error de conexión:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Reconectando...');
                this.connect(); // Reconectar automáticamente en caso de pérdida de conexión
            } else {
                throw err; // Para otros errores, lanza la excepción
            }
        });
    }

    getConnection() {
        return this.connection; // Permitir acceso directo a la conexión si es necesario
    }
}

// Configuración de la base de datos
const dbConfig = {
    host: 'bycyqzbdadxwtqtuvaoa-mysql.services.clever-cloud.com',
    user: 'ufk4d4narvb0tavn',
    password: 'XU9lekbFRYrbXsOVCY79',
    database: 'bycyqzbdadxwtqtuvaoa'
};

// Exportar instancia de la clase
const db = new Database(dbConfig).getConnection();
module.exports = db;
