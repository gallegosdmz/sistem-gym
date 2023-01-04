const { request, response } = require('express');

const esAdminRole = (req = request, res = response, next) => {
    if (!req.empleado) {
        return res.status(500).json({
            msg: 'Se quiere verficiar el rol sin validar el token primero'
        });
    }

    const {rol, nombre} = req.empleado;

    const rol_upper = rol.toUpperCase();

    if (rol_upper !== 'ADMIN') {
        return res.status(401).json({
            msg: `${nombre}, no es administrador - No puede hacer esto`
        });
    }
    
    next();
}

const esEmpleadoRole = (req = request, res = response, next) => {
    if (!req.empleado) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {rol, nombre} = req.empleado;

    const rol_upper = rol.toUpperCase();

    if (rol_upper !== 'ENTRENADOR' && rol_upper !== 'RECEPCIONISTA' && rol_upper !== 'ADMIN') {
        return res.status(401).json({
            msg: `${nombre}, no es entrenador o recepcionista - No puede hacer esto`
        });
    }

    next();
}

module.exports = {
    esAdminRole,
    esEmpleadoRole
}