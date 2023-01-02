const { request, response } = require('express'); 
const jwt = require('jsonwebtoken');
const { Administrador, Empleado } = require('../models/');

const validarJWT_Admin = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const administrador = await Administrador.findById(uid);

        if (!administrador) {
            return res.status(401).json({
                msg: 'El usuario no existe en la BD'
            });
        }

        // Verificar si el udi tiene estado en TRUE
        if (!administrador.estado) {
            return res.status(401).json({
                msg: 'Usuario con estado false'
            });
        }

        req.administrador = administrador;

        next();
    } catch(err) {
        console.log(err);

        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const administrador = await Administrador.findById(uid);
        const empleado = await Empleado.findById(uid);
        
        if (administrador) {
            if (!administrador) {
                return res.status(401).json({
                    msg: 'El usuario no existe en la BD'
                });
            }
    
            // Verificar si el udi tiene estado en TRUE
            if (!administrador.estado) {
                return res.status(401).json({
                    msg: 'Usuario con estado false'
                });
            }

            req.administrador = administrador;

            next();
            
        } else {
            if (!empleado) {
                return res.status(401).json({
                    msg: 'El usuario no existe en la BD'
                });
            }
    
            // Verificar si el udi tiene estado en TRUE
            if (!empleado.estado) {
                return res.status(401).json({
                    msg: 'Usuario con estado false'
                });
            }

            req.empleado = empleado;

            next();
        }        
    } catch(err) {
        console.log(err);

        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT_Admin,
    validarJWT
}