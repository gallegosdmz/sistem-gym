const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const { Empleado } = require('../models');

const { generarJWT } = require('../helpers');

const login = async(req = request, res = response) => {
    const {correo, password} = req.body;

    try {
        // Verificar si el email existe
        const empleado = await Empleado.findOne({correo});

        if (!empleado) {
            return res.status(400).json({
                msg: 'El correo no existe'
            });
        }

        // Verificar si el usuario está activo en la base de datos
        if (!empleado.estado) {
            return res.status(400).json({
                msg: 'Usuario desactivado del sistema'
            });
        }

        // Verficar la contraseña
        const validPassword = bcryptjs.compareSync(password, empleado.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraeña incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT(empleado.id);

        res.json({
            empleado,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const renovarToken = async(req = request, res = response) => {
    const {empleado} = req;

    //Generar el JWT
    const token = await generarJWT(empleado.id);

    res.json({
        empleado,
        token
    });
}

module.exports = {
    login,
    renovarToken
}