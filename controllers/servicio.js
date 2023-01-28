const { response, request } = require('express');
const { Servicio } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerServicios = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, servicios] = await Promise.all([
        Servicio.countDocuments(query),
        Servicio.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        servicios
    });
}

const obtenerServicio = async(req = request, res = response) => {
    const { id } = req.params;

    const servicio = await Servicio.findById(id);

    if (!servicio.estado) {
        return res.status(400).json({
            msg: 'El servicio está eliminado de la BD'
        });
    }

    res.json({
        servicio
    });
}

const crearServicio = async(req = request, res = response) => {
    const { estado, ...body } = req.body;

    const servicio = new Servicio(body);

    // Guardar en BD
    await servicio.save();

    res.status(201).json({
        servicio
    });
}

const editarServicio = async(req = request, res = response) => {
    const { id } = req.params;

    const { estado, ...body } = req.params;

    const servicio = await Servicio.findByIdAndUpdate(id, body, {new: true});

    res.json({
        servicio
    });
}

const eliminarServicio = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const servicio = await Servicio.findByIdAndUpdate(id, data, {new: true});

    res.json({
        servicio
    });
}

module.exports = {
    obtenerServicios,
    obtenerServicio,
    crearServicio,
    editarServicio,
    eliminarServicio
}