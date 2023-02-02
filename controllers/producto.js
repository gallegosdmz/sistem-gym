const { response, request } = require('express');
const { Producto } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id).populate('empleado', 'uid nombre')
                                                .populate('categoria', 'nombre')
                                                .populate('proveedor', 'nombre telefono');
    
    if (!producto.estado) {
        return res.status(400).json({
            msg: 'El producto está eliminado de la BD'
        });
    }

    res.json({
        producto
    })
}

const crearProducto = async(req = request, res = response) => {
    const { estado, ...body } = req.body;
    
    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const producto = new Producto(data);

    // Guardar en BD
    await producto.save();

    res.status(201).json({
        producto
    });
}

const editarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const { estado, ...body } = req.body;

    body.updated_at = timeStamp;

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        producto
    });
}

const eliminarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp,
        empleado: req.empleado._id
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        producto
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    editarProducto,
    eliminarProducto
}