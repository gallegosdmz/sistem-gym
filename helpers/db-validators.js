const { Empleado, Contacto } = require('../models');

// Helpers EMPLEADO
const emailExisteEmpleado = async(correo = '') => {
    const existeEmail = await Empleado.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo}, ya está registrado`);
    }
}

const empleadoExiste = async(id) => {
    const empleado = await Empleado.findById(id);

    if (!empleado) {
        throw new Error(`El empleado ${id}, no existe`);
    }
}

const curpExiste = async(curp = '') => {
    const existeCurp = await Empleado.findOne({curp});

    if (existeCurp) {
        throw new Error(`El CURP ${curp}, ya está registrado`);
    }
}

const rfcExiste = async(rfc = '') => {
    const existeRfc = await Empleado.findOne({rfc});

    if (existeRfc) {
        throw new Error(`El RFC ${rfc}, ya está registrado`);
    }
}

// Helperes CONTACTO
const contactoExiste = async(id) => {
    const existeContacto = await Contacto.findById(id);

    if (!existeContacto) {
        throw new Error(`El contacto ${id}, no existe`);
    }
}

module.exports = {
    emailExisteEmpleado,
    curpExiste,
    rfcExiste,
    contactoExiste,
    empleadoExiste
}