const { response, request, query } = require('express');
const { Reporte } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerReportes = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    
    const [total, reportes] = await Promise.all([
        Reporte.countDocuments(query),
        Reporte.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        reportes
    });
}

const obtenerReporte = async(req = request, res = response) => {
    const { id } = req.params;

    const reporte = await Reporte.findById(id).populate('cliente', 'nombre correo')
                                              .populate('empleado', 'nombre correo');

    if (!reporte.estado) {
        return res.status(400).json({
            msg: 'El reporte está eliminado de la BD'
        });
    }

    res.json({
        reporte
    });
}

const crearReporte = async(req = request, res = response) => {
    const { estado, cliente, ...body } = req.body;

    

    
}

//TODO: PENDIENTE PARA LA APLICACIÓN MOVIL

module.exports = {
    obtenerReportes,
    obtenerReporte
}