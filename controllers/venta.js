 const { response, request } = require('express');
const { Venta, Cliente } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerVentas = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, ventas] = await Promise.all([
        Venta.countDocuments(query),
        Venta.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        ventas
    });
}

const obtenerVenta = async(req = request, res = response) => {
    const { id } = req.params;

    const venta = await Venta.findById(id).populate('productos', 'uid nombre precio_venta')
                                          .populate('cliente', 'uid nombre')
                                          .populate('empleado', 'uid nombre');

    if (!venta.estado) {
        return res.status(400).json({
            msg: 'La venta está eliminada de la BD'
        });
    }

    res.json({
        venta
    })
}

const obtenerNumeroVenta = async(req = request, res = response) => {
    const ventas = await Venta.find();
    let lastNum = 0;
    let max = 0;

    ventas.forEach(x => {
        if (x.numeroVenta == 1) {
            lastNum = x.numeroVenta;
            max = x.numeroVenta;
        } else {

            if (x.numeroVenta > lastNum) {
                max = x.numeroVenta;
            }
        }
    });

    res.json({
        max
    });
}

const crearVenta = async(req = request, res = response) => {
    const { estado, empleado, cliente, fecha, ...body } = req.body;

    if (cliente) {
        const buscarCliente = await Cliente.findById(cliente);

        if (!buscarCliente) {
            return res.status(400).json({
                msg: `El cliente ${cliente}, no existe`
            });
        }

        if (!buscarCliente.estado) {
            return res.status(400).json({
                msg: `El cliente ${cliente}, está eliminado de la BD`
            });
        }

        body.cliente = cliente;
    }

    // Sacar fecha
    const time = timeStamp.toJSON();
    const date = time.slice(0, 10);
    body.fecha = date;

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const venta = new Venta(data);

    // Guardar en BD
    await venta.save();

    res.json({
        venta
    });
}

const editarVenta = async(req = request, res = response) => {
    const { id } = req.params;

    const { estado, empleado, cliente, ...body } = req.body;
    
    if (cliente) {
        const buscarCliente = await Cliente.findById(cliente);

        if (!buscarCliente) {
            return res.status(400).json({
                msg: `El cliente ${cliente}, no existe`
            });
        }

        if (!buscarCliente.estado) {
            return res.status(400).json({
                msg: `El cliente ${cliente}, está eliminado de la BD`
            });
        }

        body.cliente = cliente;
    }

    body.updated_at = timeStamp;

    const venta = await Venta.findByIdAndUpdate(id, body, {new: true});

    res.json({
        venta
    });
}

const eliminarVenta = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const venta = await Venta.findByIdAndUpdate(id, data, {new: true});

    res.json({
        venta
    });
}

module.exports = {
    obtenerVentas,
    obtenerVenta,
    obtenerNumeroVenta,
    crearVenta,
    editarVenta,
    eliminarVenta
}
