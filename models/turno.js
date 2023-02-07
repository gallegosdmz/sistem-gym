const { Schema, model } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const TurnoSchema = Schema({
    fecha: {
        type: String,
        default: timeStamp
    },

    empleados: [{
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    }],

    asistencias: [{
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    }],

    disponible: {
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
TurnoSchema.methods.toJSON = function() {
    const { __v, _id, ...turno } = this.toObject();
    turno.uid = _id;
    
    return turno;
}

module.exports = model('Turno', TurnoSchema);