const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { Cliente } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerClientes = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, clientes] = await Promise.all([
        Cliente.countDocuments(query),
        Cliente.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        clientes
    });
}

const obtenerCliente = async(req = request, res = response) => {
    const {id} = req.params;

    const cliente = await Cliente.findById(id).populate('contacto', 'nombre apellido telefono parentesco estado')
                                              .populate('empleado', 'uid nombre')
                                              .populate('mensualidad', 'tipo');

    if (!cliente.estado) {
        return res.status(400).json({
            msg: 'El cliente está eliminado de la BD'
        });
    }

    res.json({
        cliente
    });
}

const crearCliente = async(req = request, res = response) => {
    const { estado, password, empleado, ...body } = req.body;

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    pass = bcryptjs.hashSync(password, salt);

    const data = {
        ...body,
        password: pass,
        empleado: req.empleado._id
    }

    const cliente = new Cliente(data);

    // Guardar en BD
    await cliente.save();

    res.status(201).json({
        cliente
    });
}

const editarCliente = async(req = request, res = response) => {
    const {id} = req.params;
    const buscar = await Cliente.findById(id);

    const { estado, correo, password, ...body } = req.body;

    // Verificacion de correo enviado
    if (correo !== buscar.correo) {
        const buscarCorreo = await Cliente.findOne({correo});

        if (buscarCorreo) {
            return res.status(400).json({
                msg: `El correo ${correo}, ya lo está usando otro usuario`
            });
        }

        body.correo = correo;
    }

    if (password) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(password, salt);
    }

    body.updated_at = timeStamp;

    const cliente = await Cliente.findByIdAndUpdate(id, body, {new: true});

    res.json({
        cliente
    })
}

const eliminarCliente = async(req = request, res = response) => {
    const {id} = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const cliente = await Cliente.findByIdAndUpdate(id, data, {new: true});

    res.json({
        cliente
    });
}

module.exports = {
    obtenerClientes,
    obtenerCliente,
    crearCliente,
    editarCliente,
    eliminarCliente
}