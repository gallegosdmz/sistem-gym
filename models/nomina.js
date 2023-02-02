const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const NominaSchema = Schema({
    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    sueldo_base: {
        type: Number,
        required: [true, 'El sueldo base es obligatorio']
    },

    horas_extra: {type: Number},
    precio_horas: {type: Number},
    total_horas: {type: Number},
    bono_transporte: {type: Number},
    total_asignaciones: {type: Number},

    adelanto_sueldo: {type: Number},

    sueldo_bruto: {
        type: Number,
        required: [true, 'El sueldo bruto es obligatorio']
    },

    isr: {
        type: Number,
        required: [true, 'El ISR es obligatorio']
    },

    sueldo_neto: {
        type: Number,
        required: [true, 'El sueldo neto es obligatorio']
    },

    pagada: {
        type: Boolean,
        default: false
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
NominaSchema.methods.toJSON = function() {
    const { __v, _id, ...nomina } = this.toObject();
    nomina.uid = _id;

    return nomina;
}

module.exports = model('Nomina', NominaSchema);