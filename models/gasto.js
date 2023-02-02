const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const GastoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },

    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    individual: {
        type: Boolean,
        default: false
    },

    estado: {
        type: Boolean,
        default: true
    },

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },

    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio'
    },

    nomina: {
        type: Schema.Types.ObjectId,
        ref: 'Nomina'
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
GastoSchema.methods.toJSON = function() {
    const { __v, _id, ...gasto } = this.toObject();
    gasto.uid = _id;

    return gasto;
}

module.exports = model('Gasto', GastoSchema);