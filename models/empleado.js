const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const EmpleadoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatoria']
    },

    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    curp: {
        type: String,
        required: [true, 'El curp es obligatorio']
    },

    rfc: {
        type: String,
        required: [true, 'El rfc es obligatorio']
    },

    num_seguro: {type: String},

    lugar_nacimiento: {
        type: String,
        required: [true, 'El lugar de nacimiento es obligatorio']
    },

    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio']
    },

    img: {
        type: String
    },

    estado_civil: {
        type: String,
        required: [true, 'El estado civil es obligatorio']
    },

    fecha_nac: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },

    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },

    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },

    rol: {
        type: String,
        required: true,
        emun: ['ADMIN', 'ENTRENADOR', 'RECEPCIONISTA', 'CONSERJE']
    },

    contacto: {
        type: Schema.Types.ObjectId,
        ref: 'Contacto'
    },

    estado: {
        type: Boolean,
        default: true
    },

    created_at: {
        type: Date,
        default: timeStamp
    },

    updated_at: {
        type: Date,
        default: timeStamp
    },

    deleted_at: {
        type: Date
    }
});

// Sacar contraseña y __v de la respuesta del POST
EmpleadoSchema.methods.toJSON = function() {
    const { __v, password, _id, ...empleado } = this.toObject();
    empleado.uid = _id;

    return empleado;
}

module.exports = model('Empleado', EmpleadoSchema);