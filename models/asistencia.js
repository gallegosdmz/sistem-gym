const { Schema, model } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const AsistenciaSchema = Schema({
    fecha: {
        type: String,
        default: timeStamp
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
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

// Sacar  __v de la respuesta POST
AsistenciaSchema.methods.toJSON = function() {
    const { __v, _id, ...asistencia } = this.toObject();
    asistencia.uid = _id;
    
    return asistencia;
}

module.exports = model('Asistencia', AsistenciaSchema);