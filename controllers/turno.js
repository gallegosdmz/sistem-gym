const { response, request } = require('express');
const { Turno, Asistencia } = require('../models');

const { CurrentDate } = require('../helpers');
const timeStamp = CurrentDate();

const obtenerTurnos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, turnos] = await Promise.all([
        Turno.countDocuments(query),
        Turno.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        turnos
    });
}

const obtenerTurno = async(req = request, res = response) => {
    const { id } = req.params;

    const turno = await Turno.findById(id).populate('empleado', 'uid nombre apellido correo')
                                          .populate('asistencias', 'fecha cliente');

    if (!turno.estado) {
        return res.status(400).json({
            msg: 'El turno está eliminado de la BD'
        });
    }

    res.json({
        turno
    })
}

const crearTurno = async(req = request, res = response) => {
    const { estado, empleados, asistencias, ...body } = req.body;

    /* if (asistencias) {
        asistencias.forEach( async x => {
            const buscarAsistencia = await Asistencia.findById(x);

            if (!buscarAsistencia) {
                return res.status(400).json({
                    msg: `La asistencia ${x}, no existe`
                });
            }

            if (!buscarAsistencia.estado) {
                return res.status(400).json({
                    msg: `La asistencia ${x}, está eliminada de la BD`
                });
            }
        });

        body.asistencias = asistencias
    } */

    const data = {
        ...body,
        empleados: req.empleado._id
    }

    const turno = new Turno(data);

    // Guardar en BD
    await turno.save();

    res.json({
        turno
    });
}

const editarTurno = async(req = request, res = response) => {
    let data = {};

    const { id } = req.params;

    const { estado, empleados, asistencias, ...body } = req.body;

    const { empleados: empleadosDB } = await Turno.findById(id);

    body.updated_at = timeStamp;

    if (!empleadosDB.includes(req.empleado._id)) {
        empleadosDB.push(req.empleado._id);

        data = {
            ...body,
            empleados: empleadosDB
        }
    } else {
        data = {
            ...body
        }
    }

    const turno = await Turno.findByIdAndUpdate(id, data, {new: true});

    res.json({
        turno
    });
}

const eliminarTurno = async(req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        deleted_at: timeStamp
    }

    const turno = await Turno.findByIdAndUpdate(id, data, {new: true});

    res.json({
        turno
    });
}

module.exports = {
    obtenerTurnos,
    obtenerTurno,
    crearTurno,
    editarTurno,
    eliminarTurno
}