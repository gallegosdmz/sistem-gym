const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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

    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },

    mensualidad: {
        type: Schema.Types.ObjectId,
        ref: 'Mensualidade',
        required: true
    },

    fecha_pago: {
        type: Date,
        default: timeStamp,
    },

    contacto: {
        type: Schema.Types.ObjectId,
        ref: 'Contacto'
    },

    tipo_sangre: {type: String},

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    fecha_nac: {
        type: Date
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

// Sacar contraseña y __v de la respuesta POST
ClienteSchema.methods.toJSON = function() {
    const { __v, password, _id, ...cliente } = this.toObject();
    cliente.uid = _id;
    
    return cliente;
}

module.exports = model('Cliente', ClienteSchema);