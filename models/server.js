const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Paths de rutas
        this.paths = {
            auth: '/auth',
            cliente: '/cliente',
            contacto: '/contacto',
            empleado: '/empleado',
            mensualidad: '/mensualidad',
            nomina: '/nomina'
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
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.cliente, require('../routes/cliente.routes'));
        this.app.use(this.paths.contacto, require('../routes/contacto.routes'));
        this.app.use(this.paths.empleado, require('../routes/empleado.routes'));
        this.app.use(this.paths.mensualidad, require('../routes/mensualidad.routes'));
        this.app.use(this.paths.nomina, require('../routes/nomina.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;