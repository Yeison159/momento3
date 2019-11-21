const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    origen: {
        type: Number,
        required: true,
        trim: true
    },
    destino: {
        type: Number,
        required: true,
        trim: true
    },
    fecha: {
        type: Date,
       default: Date.now()
    },
    valor: {
        type: Number,
        required: true,
        trim: true
    },
    correoO: {
        type: String,
        required: true,
        trim: true
    },
    correoD: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Transaccion', userSchema);
