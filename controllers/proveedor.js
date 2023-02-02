const { response, request } = require('express');
const { Proveedor } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerProveedores = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, proveedores] = await Promise.all([
        Proveedor.countDocuments(query),
        Proveedor.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        proveedores
    });
}

const obtenerProveedor = async(req = request, res = response) => {
    const { id } = req.params;

    const proveedor = await Proveedor.findById(id);

    if (!proveedor.estado) {
        return res.status(400).json({
            msg: 'El proveedor está eliminado de la BD'
        });
    }

    res.json({
        proveedor
    });
}

const crearProveedor = async(req = request, res = response) => {
    const { estado, ...body } = req.body;

    const proveedor = new Proveedor(body);

    // Guardar en BD
    await proveedor.save();

    res.status(201).json({
        proveedor
    });
}

const editarProveedor = async(req = request, res = response) => {
    const { id } = req.params;

    const { estado, ...body } = req.body;

    body.updated_at = timeStamp;

    const proveedor = await Proveedor.findByIdAndUpdate(id, body, {new: true});

    res.json({
        proveedor
    });
}

const eliminarProveedor = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const proveedor = await Proveedor.findByIdAndUpdate(id, data, {new: true});

    res.json({
        proveedor
    });
}

module.exports = {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    editarProveedor,
    eliminarProveedor
}