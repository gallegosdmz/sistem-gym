const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const AdministradorSchema = Schema({
    nombre: {
        type: String
    },
    
    apellido: {
        type: String
    },

    correo: {
        type: String
    },

    password: {
        type: String
    },

    img: {
        type: String
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
AdministradorSchema.methods.toJSON = function() {
    const{ __v, password, _id, ...administrador } = this.toObject();
    administrador.uid = _id;

    return administrador;
}

module.exports = model('Administradore', AdministradorSchema);