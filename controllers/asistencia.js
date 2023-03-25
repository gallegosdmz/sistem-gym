const { response, request } = require('express');
const { Asistencia, Cliente } = require('../models');

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

const obtenerAsistenciasPasadas = async(req = request, res = response) => {
    const { fecha } = req.query;
    const query = {estado: true, fecha: fecha};

    const [total, asistencias] = await Promise.all([
        Asistencia.countDocuments(query),
        Asistencia.find(query)
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
    const { estado, empleado, correo, ...body } = req.body;

    const cliente = await Cliente.findOne({correo});

    if (!cliente) {
        return res.status(400).json({
            msg: 'El correo no existe'
        });
    }

    if (!cliente.mensualidad_pagada) {
        return res.status(400).json({
            msg: 'La mensualidad está vencida'
        });
    }

    body.cliente = cliente._id;

    const hoy = new Date();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    const fecha = hoy.toLocaleDateString();
    const array = fecha.split('/');

    let fechaActual = '';

    if (array[1].length === 1) {
         fechaActual = array[2] + "-0" + array[1] + "-" + array[0];
    } else {
         fechaActual = array[2] + "-" + array[1] + "-" + array[0];
    }

    body.horaEntrada = hora;
    body.fecha = fechaActual;

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
    obtenerAsistenciasPasadas,
    crearAsistencia,
    eliminarAsistencia
}