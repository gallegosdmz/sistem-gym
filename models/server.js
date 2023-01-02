const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Paths de rutas
        this.paths = {
            administrador: '/administrador',
            contacto: '/contacto',
            empleado: '/empleado'
        }

        // Conecatar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.administrador, require('../routes/administrador.routes'));
        this.app.use(this.paths.contacto, require('../routes/contacto.routes'));
        this.app.use(this.paths.empleado, require('../routes/empleado.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;