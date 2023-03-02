const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');

const { Empleado, Cliente, Producto } = require('../models');

const actualizarImagen = async(req, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }

    const { id, coleccion } = req.params;

    let modelo;

    switch(coleccion) {
        case 'empleados':
            modelo = await Empleado.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un empleado con el id ${id}`
                });
            }
            break;

        case 'clientes':
            modelo = await Cliente.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un cliente con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no está validado'
            });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];

        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

module.exports = {
    actualizarImagen
}