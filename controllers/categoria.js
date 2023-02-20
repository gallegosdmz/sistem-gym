const { response, request } = require('express');
const { Categoria } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
       total,
       categorias 
    });
}

const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    
    const categoria = await Categoria.findById(id).populate('empleado', 'uid nombre apellido estado correo');

    if (!categoria.estado) {
        return res.status(400).json({
            msg: 'La categoria está eliminada de la BD'
        });
    }

    res.json({
        categoria
    });
}

const crearCategoria = async(req = request, res = response) => {
    const { estado, ...body } = req.body;

    const data = {
        ...body,
        empleado: req.empleado._id
    }

    const categoria = new Categoria(data);

    // Guardar en BD
    await categoria.save();

    res.status(201).json({
        categoria
    });
}

const editarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const buscar = await Categoria.findById(id);

    const { estado, nombre, ...body } = req.body;

    // Verificacion de nombre enviado
    if (nombre !== buscar.nombre) {
        const buscarNombre = await Categoria.findOne({nombre});

        if (buscarNombre) {
            return res.status(400).json({
                msg: `El nombre ${nombre}, ya está en uso`
            });
        }

        body.nombre = nombre;
    }

    body.updated_at = timeStamp;

    const data = {
        ...body,
        empleado: req.empleado._id
    }
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoria
    });
}

const eliminarCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoria
    });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
}