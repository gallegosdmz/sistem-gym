const { Schema, model, trusted } = require('mongoose');

const { CurrentDate } = require('../helpers');

// Sacar horario laboral
const timeStamp = CurrentDate();

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
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

// Sacar __v de la respuesta del POST
CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, ...categoria } = this.toObject();
    categoria.uid = _id;

    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);