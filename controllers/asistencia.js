const { response, request } = require('express');
const { Asistencia } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerAsistencias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, asistencias] = await Promise.all([
        Asistencia.countDocuments(query),
        Asistencia.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        asistencias
    });
}

const obtenerAsistencia = async(req = request, res = response) => {
    const { id } = req.params;

    const asistencia = await Asistencia.findById(id).populate('empleado', 'uid nombre correo')
                                                    .populate('cliente', 'uid')
}

module.exports = {
    obtenerAsistencias
}