const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const ReporteSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },

    description: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado'
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
ReporteSchema.methods.toJSON = function() {
    const { __v, _id, ...reporte } = this.toObject();
    reporte.uid = _id;

    return reporte;
}

module.exports = model('Reporte', ReporteSchema);