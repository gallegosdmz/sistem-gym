const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const ProveedorSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },

    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },

    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
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
ProveedorSchema.methods.toJSON = function() {
    const { __v, _id, ...proveedor } = this.toObject();
    proveedor.uid = _id;

    return proveedor;
}

module.exports = model('Proveedore', ProveedorSchema);