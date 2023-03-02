const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const VentaSchema = Schema({
    numeroVenta: {
        type: Number,
        required: [true, 'El numero de venta es obligatorio']
    },

    subtotal: {
        type: Number,
        required: [true, 'El subtotal es obligatorio']
    },

    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria']
    },

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },

    mensualidad: {
        type: Schema.Types.ObjectId,
        ref: 'Mensualidade'
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    fecha: {
        type: String,
        default: timeStamp
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
VentaSchema.methods.toJSON = function() {
    const { __v, _id, ...venta } = this.toObject();
    venta.uid = _id;

    return venta;
}

module.exports = model('Venta', VentaSchema);