const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Paths de rutas
        this.paths = {
            asistencia: '/asistencia',
            auth: '/auth',
            categoria: '/categoria',
            cliente: '/cliente',
            contacto: '/contacto',
            empleado: '/empleado',
            ganancia: '/ganancia',
            gasto: '/gasto',
            mensualidad: '/mensualidad',
            nomina: '/nomina',
            producto: '/producto',
            proveedor: '/proveedor',
            servicio: '/servicio',
            turno: '/turno',
            upload: '/upload',
            venta: '/venta'
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

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.asistencia, require('../routes/asistencia.routes'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categoria, require('../routes/categoria.routes'));
        this.app.use(this.paths.cliente, require('../routes/cliente.routes'));
        this.app.use(this.paths.contacto, require('../routes/contacto.routes'));
        this.app.use(this.paths.empleado, require('../routes/empleado.routes'));
        this.app.use(this.paths.ganancia, require('../routes/ganancia.routes'));
        this.app.use(this.paths.gasto, require('../routes/gasto.routes'));
        this.app.use(this.paths.mensualidad, require('../routes/mensualidad.routes'));
        this.app.use(this.paths.nomina, require('../routes/nomina.routes'));
        this.app.use(this.paths.producto, require('../routes/producto.routes'));
        this.app.use(this.paths.proveedor, require('../routes/proveedor.routes'));
        this.app.use(this.paths.servicio, require('../routes/servicio.routes'));
        this.app.use(this.paths.turno, require('../routes/turno.routes'));
        this.app.use(this.paths.upload, require('../routes/uploads.routes'));
        this.app.use(this.paths.venta, require('../routes/venta.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;