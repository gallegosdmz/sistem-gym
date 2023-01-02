const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario local
const timeStamp = CurrentDate();

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    description: {type: String},

    precio_venta: {
        type: Number,
        required: [true, 'El precio de venta es obligatorio']
    },

    precio_compra: {
        type: Number,
        required: [true, 'El precio de compra es obligatorio']
    },

    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },

    img: {type: String},

    disponible: {
        type: Boolean,
        default: true
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },

    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedore'
    },

    individual: {
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
ProductoSchema.methods.toJSON = function() {
    const { __v, _id, ...producto } = this.toObject();
    producto.uid = _id;

    return producto;
}

module.exports = model('Producto', ProductoSchema);