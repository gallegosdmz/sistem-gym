const { response, request } = require('express');
const { Nomina } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerNominas = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, nominas] = await Promise.all([
        Nomina.countDocuments(query),
        Nomina.find(query)
        .populate('empleado', 'nombre apellido correo')
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        nominas
    });
}

const obtenerNomina = async(req = request, res = response) => {
    const {id} = req.params;

    const nomina = await Nomina.findById(id).populate('empleado', 'nombre apellido correo');

    if (!nomina.estado) {
        return res.status(400).json({
            msg: 'El cliente está eliminado de la BD'
        });
    }

    res.json({
        nomina
    });
}

const crearNomina = async(req = request, res = response) => {
    const { estado, pagada, ...body } = req.body;

    if (pagada) {
        return res.status(400).json({
            msg: 'La nomina ya está pagada'
        });
    }

    const nomina = new Nomina({...body});
    
    // Guardar en BD
    await nomina.save();

    res.status(201).json({
        nomina
    });
}

const editarNomina = async(req = request, res = response) => {
    const {id} = req.params;

    const { estado, ...body } = req.body;

    body.updated_at = timeStamp;

    const nomina = await Nomina.findByIdAndUpdate(id, body, {new: true});

    res.json({
        nomina
    });
}

const eliminarNomina = async(req = request, res = response) => {
    const {id} = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const nomina = await Nomina.findByIdAndUpdate(id, data, {new: true});

    res.json({
        nomina
    });
}

module.exports = {
    obtenerNominas,
    obtenerNomina,
    crearNomina,
    editarNomina,
    eliminarNomina
}