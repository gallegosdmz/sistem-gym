const { response, request } = require('express');

const { Mensualidad } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerMensualidades = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

    const [total, mensualidades] = await Promise.all([
        Mensualidad.countDocuments(query),
        Mensualidad.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        mensualidades
    });
}

const obtenerMensualidad = async(req = request, res = response) => {
    const {id} = req.params;

    const mensualidad = await Mensualidad.findById(id);

    if (!mensualidad.estado) {
        return res.status(400).json({
            msg: 'La mensualidad está eliminado en la BD'
        });
    }

    res.json({
        mensualidad
    });
}

const crearMensualidad = async(req = request, res = response) => {
    const { tipo, precio } = req.body;

    const mensualidad = new Mensualidad({tipo, precio});

    // Guardar en BD
    await mensualidad.save();

    res.json({
        mensualidad
    });
}

const editarMensualidad = async(req = request, res = response) => {
    const {id} = req.params;

    const {_id, ...resto} = req.body;

    // Hora de acutalización
    resto.updated_at = timeStamp;

    const mensualidad = await Mensualidad.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        mensualidad
    });
}

const eliminarMensualidad = async(req = request, res = response) => {
    const {id} = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const mensualidad = await Mensualidad.findByIdAndUpdate(id, data, {new: true});

    res.json({
        mensualidad
    });
}

module.exports = {
    obtenerMensualidades,
    obtenerMensualidad,
    crearMensualidad,
    editarMensualidad,
    eliminarMensualidad
}