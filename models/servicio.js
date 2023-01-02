const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const ServicioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    description: {type: String},

    fecha_pago: {
        type: Date,
        default: timeStamp,
        required: true
    },

    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },

    company: {
        type: String,
        required: [true, 'La compañia es obligatoria']
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
ServicioSchema.methods.toJSON = function() {
    const { __v, _id, ...servicio } = this.toObject();
    servicio.uid = _id;

    return servicio;
}

module.exports = model('Servicio', ServicioSchema);