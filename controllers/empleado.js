const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const { Empleado } = require('../models');

const { CurrentDate } = require('../helpers');

const timeStamp = CurrentDate();

const obtenerEmpleados = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, empleados] = await Promise.all([
        Empleado.countDocuments(query),
        Empleado.find(query)
        .populate('contacto', 'nombre apellido telefono parentesco')
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        empleados
    });
}

const obtenerEmpleado = async(req = request, res = response) => {
    const {id} = req.params;

    const empleado = await Empleado.findById(id).populate('contacto', 'nombre apellido telefono parentesco estado');

    if (!empleado.estado) {
        return res.status(400).json({
            msg: 'El empleado está eliminao de la BD'
        });
    }

    res.json({
        empleado
    });
}

const crearEmpleado = async(req = request, res = response) => {
    const {estado, password, rol, ...body} = req.body;

    const rol_upper = rol.toUpperCase();

    if (rol_upper != 'ENTRENADOR' && rol_upper != 'RECEPCIONISTA' && rol_upper != 'CONSERJE' && rol_upper != 'ADMIN') {
        return res.status(400).json({
            msg: `El rol ${rol_upper} no existe`
        });
    }

    body.rol = rol_upper;
    const empleado = new Empleado({...body});

    // Encriptar la contraeña
    const salt = bcryptjs.genSaltSync();
    empleado.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await empleado.save();

    res.status(201).json({
        empleado
    });
}

const editarEmpleado = async(req = request, res = response) => {
    const {id} = req.params;
    const buscar = await Empleado.findById(id);

    const {estado, rol, correo, curp, rfc, password, ...body} = req.body;

    // Verificacion de correo enviado
    if (correo !== buscar.correo) {
        const buscarCorreo = await Usuario.findOne({correo});

        if (buscarCorreo) {
            return res.status(400).json({
                msg: `El correo ${correo}, ya lo está usando otro usuario`
            });
        }

        body.correo = correo;
    }

    // Verificacion de curp enviada
    if (curp !== buscar.curp) {
        const buscarCurp = await Usuario.findOne({curp});

        if (buscarCurp) {
            return res.status(400).json({
                msg: `La curp ${curp}, ya la está usando otro usuario`
            });
        }

        body.curp = curp;
    }

    // Verificacion de rfc enviada
    if (rfc !== buscar.rfc) {
        const buscarRfc = await Usuario.findOne({rfc});

        if (buscarRfc) {
            return res.status(400).json({
                msg: `La rfc ${rfc}, ya la está usando otro usuario`
            });
        }

        body.rfc = rfc;
    }

    const rol_upper = rol.toUpperCase();

    if (rol_upper != 'ENTRENADOR' && rol_upper != 'RECEPCIONISTA' && rol_upper != 'CONSERJE') {
        return res.status(400).json({
            msg: `El rol ${rol_upper} no existe`
        });
    }

    if (password) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(password, salt);
    }

    body.rol = rol_upper;
    body.updated_at = timeStamp;

    const empleado = await Empleado.findByIdAndUpdate(id, body, {new: true});

    res.json({
        empleado
    });
}

const editarPassword = async(req = request, res = response) => {
    const {id} = req.params;

    const { password, newPassword, ...body } = req.body;

    const empleado = await Empleado.findById(id);

    const validPassword = bcryptjs.compareSync(password, empleado.password);
    if (!validPassword) {
        return res.status(400).json({
            msg: 'Contraseña incorrecta'
        });
    }

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    body.password = bcryptjs.hashSync(newPassword, salt);


    const update = await Empleado.findByIdAndUpdate(id, body, {new: true});

    res.json({
        update
    });
}

const eliminarEmpleado = async(req = request, res = response) => {
    const {id} = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const empleado = await Empleado.findByIdAndUpdate(id, data, {new: true});

    res.json({
        empleado
    });
}

module.exports = {
    crearEmpleado,
    obtenerEmpleados,
    obtenerEmpleado,
    editarEmpleado,
    editarPassword,
    eliminarEmpleado
}