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
                                                    .populate('cliente', 'uid nombre correo');

    if (!asistencia.estado) {
        return res.status(400).json({
            msg: 'La asistencia está eliminada de la BD'
        });
    }

    res.json({
        asistencia
    });
}

const crearAsistencia = async(req = request, res = response) => {
    const { estado, empleado, ...body } = req.body;

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const asistencia = new Asistencia(data);

    // Guardar en BD
    await asistencia.save();

    res.json({
        asistencia
    });
}

const eliminarAsistencia = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const asistencia = await Asistencia.findByIdAndUpdate(id, data, {new: true});

    res.json({
        asistencia
    });
} 

module.exports = {
    obtenerAsistencias,
    obtenerAsistencia,
    crearAsistencia,
    eliminarAsistencia
}