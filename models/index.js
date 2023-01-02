const Server = require('./server');

const Administrador = require('./administrador');
const Categoria = require('./categoria');
const Cliente = require('./cliente');
const Contacto = require('./contacto');
const Empleado = require('./empleado');
const Gasto = require('./gasto');
const Mensualidad = require('./mensualidad');
const Nomina = require('./nomina');
const Producto = require('./producto');
const Proveedor = require('./proveedor');
const Reporte = require('./reporte');
const Servicio = require('./servicio');
const Venta = require('./venta');

module.exports = {
    Administrador,
    Categoria,
    Cliente,
    Contacto,
    Empleado,
    Gasto,
    Mensualidad,
    Nomina,
    Producto,
    Proveedor,
    Reporte,
    Servicio,
    Server,
    Venta
}