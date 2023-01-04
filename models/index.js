const Server = require('./server');

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
const Role = require('./role');
const Servicio = require('./servicio');
const Venta = require('./venta');

module.exports = {
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
    Role,
    Servicio,
    Server,
    Venta
}