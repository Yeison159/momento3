const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    cedula: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
        cuenta: [{
        nroCuenta: {
            type: Number,
            unique: true,
        },
        fecha: {
            type: Date,
            default: Date.now(),
            trim: true
        },
        saldo: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('Usuario', userSchema);
