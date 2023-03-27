const { response, request } = require('express');
const { Gasto, Producto, Servicio, Nomina } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerGastos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, gastos] = await Promise.all([
        Gasto.countDocuments(query),
        Gasto.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        gastos
    });
}

const obtenerGasto = async(req = request, res = response) => {
    const { id } = req.params;

    const gasto = await Gasto.findById(id).populate('producto', 'uid nombre precio')
                                          .populate('servicio', 'uid nombre precio')
                                          .populate('nomina', 'uid sueldo_neto');

    if (!gasto.estado) {
        return res.status(400).json({
            msg: 'El gasto está eliminado de la BD'
        });
    }

    res.json({
        gasto
    });
}

const crearGasto = async(req = request, res = response) => {
    const { estado, producto, servicio, nomina, fecha, ...body } = req.body;

    // Sacar fecha
    const time = timeStamp.toJSON();
    const date = time.slice(0, 10);
    body.fecha = date;

    if (producto) {
        const buscarProducto = await Producto.findById(producto);

        if (!buscarProducto) {
            return res.status(400).json({
                msg: `El producto ${producto}, no existe`
            });
        }

        if (!buscarProducto.estado) {
            return res.status(400).json({
                msg: `El producto ${producto}, está eliminado de la BD`
            });
        } 

        body.producto = producto;
    }

    if (servicio) {
        const buscarServicio = await Servicio.findById(servicio);

        if (!buscarServicio) {
            return res.status(400).json({
                msg: `El servicio ${servicio}, no existe`
            });
        }
    
        if (!buscarServicio.estado) {
            return res.status(400).json({
                msg: `El servicio ${servicio}, está eliminado de la BD`
            });
        }

        body.servicio = servicio;
    }

    if (nomina) {
        const buscarNomina = await Nomina.findById(nomina);

        if (!buscarNomina) {
            return res.status(400).json({
                msg: `La nomina ${nomina}, no existe`
            });
        }
    
        if (!buscarNomina.estado) {
            return res.status(400).json({
                msg: `La nomina ${nomina}, está eliminado de la BD`
            });
        }

        if (!buscarNomina.pagada) {
            return res.status(400).json({
                msg: `La nomina ${nomina}, todavia no ha sido pagada`
            });
        }

        body.nomina = nomina;
    }

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const gasto = new Gasto(data);

    // Guardar en BD
    await gasto.save();

    res.status(201).json({
        gasto
    });
}

const editarGasto = async(req = request, res = response) => {
    const { id } = req.params;

    const { estado, ...body } = req.body;

    body.updated_at = timeStamp;

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const gasto = await Gasto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        gasto
    });
}

const eliminarGasto = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp,
        empleado: req.empleado._id
    }

    const gasto = await Gasto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        gasto
    });
}

module.exports = {
    obtenerGastos,
    obtenerGasto,
    crearGasto,
    editarGasto,
    eliminarGasto
}