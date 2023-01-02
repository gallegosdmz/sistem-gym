const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { Administrador } = require('../models');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const {correo, password} = req.body;

    try {
        // Verificar si el email existe
        const administrador = await Administrador.findOne({correo});
        if (!administrador) {
            return res.status(400).json({
                msg: 'El correo no existe'
            });
        }

        // Verificar si el usuario está activo en la base de datos
        if (!administrador.estado) {
            return res.status(400).json({
                msg: 'Usuario desactivado del sistema'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, administrador.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        // Generar JWT
        const token = await generarJWT(administrador.id);

        res.json({
            msg: 'ok',
            administrador,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login
}