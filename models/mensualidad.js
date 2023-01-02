const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const MensualidadSchema = Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo es obligatorio']
    },

    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
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
MensualidadSchema.methods.toJSON = function() {
    const { __v, _id, ...mensualidad } = this.toObject();
    mensualidad.uid = _id;

    return mensualidad;
}

module.exports = model('Mensualidade', MensualidadSchema);