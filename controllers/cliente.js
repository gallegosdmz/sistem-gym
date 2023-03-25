const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { Cliente, Mensualidad } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const ingresarCorreo = async(req = request, res = response) => {
    const { correo } = req.body;

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

    res.json({
        cliente
    });
}

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
    const { estado, password, empleado, mensualidad, ...body } = req.body;

    const { precio } = await Mensualidad.findById(mensualidad);
    body.mensualidad = mensualidad;

    const hoy = new Date();

    const fecha = hoy.toLocaleDateString();
    const array = fecha.split('/');

    let fechaActual = '';

    if (array[1].length === 1) {
         fechaActual = array[2] + "-0" + array[1] + "-" + array[0];
    } else {
         fechaActual = array[2] + "-" + array[1] + "-" + array[0];
    }

    body.fecha_pago = '2023-03-20';

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
        cliente,
        precio
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

const actualizarEstadoMensualidad = async(req = request, res = response) => {
    const query = {estado: true};
    const clientes = await Cliente.find(query);

    const hoy = new Date();

    const fecha = hoy.toLocaleDateString();
    const array = fecha.split('/');

    let fechaActual = '';

    if (array[1].length === 1) {
         fechaActual = array[2] + "-0" + array[1] + "-" + array[0];
    } else {
         fechaActual = array[2] + "-" + array[1] + "-" + array[0];
    }
    
    let clientesVencidos = [];
    let fechaBD = '';
    
    const data = {
        mensualidad_pagada: false
    }

    clientes.forEach(async(x) => {
        fechaBD = x.fecha_pago;

        if (fechaActual > fechaBD) {
            clientesVencidos.push(x);

            await Cliente.findByIdAndUpdate(x._id, data, {new: true});
        }
    });

    res.json({
        clientesVencidos
    });
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
    ingresarCorreo,
    obtenerClientes,
    obtenerCliente,
    crearCliente,
    editarCliente,
    actualizarEstadoMensualidad,
    eliminarCliente
}