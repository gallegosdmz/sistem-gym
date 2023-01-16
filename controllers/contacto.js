const { response, request } = require('express');

const { Contacto } = require('../models');

const { CurrentDate } = require('../helpers');

const timeStamp = CurrentDate();

const obtenerContactos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, contactos] = await Promise.all([
        Contacto.countDocuments(query),
        Contacto.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        contactos
    });
}

const obtenerContacto = async(req = request, res = response) => {
    const {id} = req.params;

    const contacto = await Contacto.findById(id);

    if (!contacto.estado) {
        return res.status(400).json({
            msg: 'El contacto está eliminado en la BD'
        });
    }

    res.json({
        contacto
    });
}

const crearContacto = async(req = request, res = response) => {
    const {
        nombre,
        apellido,
        telefono,
        parentesco
    } = req.body;

    const contacto = new Contacto({nombre, apellido, telefono, parentesco});

    // Guardar en BD
    await contacto.save();

    res.json({
        contacto
    });
}

const editarContacto = async(req = request, res = response) => {
    const {id} = req.params;
    
    const {_id, ...resto} = req.body;

    // Hora de actualización
    resto.updated_at = timeStamp;

    const contacto = await Contacto.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        contacto
    });
}

const eliminarContacto = async(req = request, res = response) => {
    const {id} = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const contacto = await Contacto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        contacto
    });
}

module.exports = {
    obtenerContactos,
    obtenerContacto,
    crearContacto,
    editarContacto,
    eliminarContacto
}