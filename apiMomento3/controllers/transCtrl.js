const Transaccion = require('../models/transaccionModels');
const Usuario = require('../models/userModel');

exports.isertarTra = (req, res) => {
    if (req.body.destino === undefined ) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo destino esta vacio',
            data: [],
        });
    }

    if (req.body.origen === undefined) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo origen esta vacio',
            data: [],
        });
    }

    if (req.body.valor === undefined || req.body.valor <= 1000) {
        return res.json({
            estado: 2,
            msg: 'Campo origen esta vacio o es menor a 1000',
            data: [],
        });
    }

    Usuario.countDocuments({
        email: req.body.email,
        cuenta: {$elemMatch: {nroCuenta: req.body.origen}}
    }, (err, countorigen) => {

        if (err) return res.json({
            estado: 10,
            msg: err,
            data: req.body.origen,
        });

        if (countorigen === 0) {
            return res.json({
                estado: 3,
                msg: 'Cuenta origen no existen',
                data: req.body.origen,
            })
        } else {
            Usuario.countDocuments({
                email: {$ne: req.body.email},
                cuenta: {$elemMatch: {nroCuenta: req.body.destino}}
            }, (err, Coundestino) => {
                if (err) return res.json(err);

                if (Coundestino === 0) {
                    return res.json({
                        estado: 4,
                        msg: 'Cuenta destino no existe',
                        data: Coundestino,
                    })
                } else {
                    Usuario.find({
                        email: req.body.email,
                        cuenta: {$elemMatch: {nroCuenta: req.body.origen}}
                    }, {email: 1, cuenta: 1}, (err, dataOrigen) => {
                        let saldoOrigen = dataOrigen[0].cuenta[0].saldo;

                        if (saldoOrigen <= 0) {
                            return res.json({
                                estado: 5,
                                msg: 'Cuenta origen sin saldo suficiente.',
                                data: [],
                            })
                        } else {
                            Usuario.find({
                                email: {$ne: req.body.email},
                                cuenta: {$elemMatch: {nroCuenta: req.body.destino}}
                            }, {email: 1, cuenta: 1}, (err, dataDestino) => {
                                if (err) return res.json(err);

                                let saldoDestino = dataDestino[0].cuenta[0].saldo;
                                let newValororigen = saldoOrigen - req.body.valor;
                                let newValorDesti = saldoDestino + req.body.valor;

                                if (newValororigen <= 0) {
                                    return res.json({
                                        estado: 5,
                                        msg: 'Cuenta origen sin saldo suficiente.',
                                        data: [],
                                    })
                                }

                                Usuario.findOneAndUpdate({
                                        "_id": dataOrigen[0]._id,
                                        "cuenta._id": dataOrigen[0].cuenta[0]._id
                                    },
                                    {$set: {"cuenta.$.saldo": newValororigen}},
                                    {new: true, useFindAndModify: false},
                                    (err, respuesta) => {
                                        if (err) return res.json({
                                            estado: 2,
                                            msg: 'Ha ocurrido un error',
                                            data: respuesta
                                        });

                                        Usuario.findOneAndUpdate({
                                            "_id": dataDestino[0]._id,
                                            "cuenta._id": dataDestino[0].cuenta[0]._id
                                        }, {$set: {"cuenta.$.saldo": newValorDesti}}, {
                                            new: true,
                                            useFindAndModify: false
                                        }, (err, result) => {
                                            if (err) return res.json({
                                                estado: 2,
                                                msg: 'Ha ocurrido un error',
                                                data: result
                                            });

                                            const transaccion = new Transaccion();
                                            transaccion.origen = req.body.origen;
                                            transaccion.destino = req.body.destino;
                                            transaccion.valor = req.body.valor;
                                            transaccion.correoO = dataOrigen[0].email;
                                            transaccion.correoD = dataDestino[0].email;
                                            transaccion.save((err, response) => {
                                                if (err) {
                                                    return res.json({
                                                        estado: 3,
                                                        msg: 'No se guardo la transacción',
                                                        data: err
                                                    });
                                                } else {
                                                    return res.json({
                                                        estado: 1,
                                                        msg: 'Transaccion guardada con exito.',
                                                        data: response
                                                    })
                                                }
                                            });
                                        });
                                    });

                            })
                        }
                    })
                }
            })
        }

    })
};

exports.movimientos = (req, res) => {
    Transaccion.find({$or: [{correoO: req.body.email}, {correoD: req.body.email}]}, (err, datos) => {
        if (err) return res.json(err);
        res.json(datos)
    })
}
