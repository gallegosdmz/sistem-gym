const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();


const ContactoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },

    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },

    parentesco: {
        type: String,
        required: [true, 'El parentesco es obligatorio']
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

// Sacar __v de la respuesta del POST
ContactoSchema.methods.toJSON = function() {
    const { __v, _id, ...contacto } = this.toObject();
    contacto.uid = _id;

    return contacto;
}

module.exports = model('Contacto', ContactoSchema);