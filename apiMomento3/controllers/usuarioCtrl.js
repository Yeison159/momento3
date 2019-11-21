const Usuario = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.login = (req, res) => {
    let email = req.body.email;
    let clave = req.body.clave;

    Usuario.countDocuments({email: email}, (err, countLogin) => {
        if (err) return err;

        if (countLogin === 0) {
            return res.json({
                estado: 2,
                msg: 'Usuario o contraseña errada.',
                data: []
            })
        } else {
            Usuario.find({email: email}, {nombre: 1, email: 1, clave: 1, cuenta: 1}, (err, user) => {
                if (err) {
                    return err
                } else {
                    bcrypt.compare(clave, user[0].clave, function (err, validar) {
                        // res == true
                        if (err) res.status(400).json(err);

                        if (validar) {
                            req.session.userId = user[0]._id;
                            req.session.email = user[0].email;
                            return res.json({
                                estado: 1,
                                msg: 'Bienvenido.',
                                data: {
                                    nombre: user[0].nombre,
                                    email: user[0].email,
                                    cuenta: user[0].cuenta,
                                    id: user[0]._id
                                }
                            })
                        } else {
                            return res.json({
                                estado: 4,
                                msg: 'Usuario o contraseña errada.',
                                data: [],
                            })
                        }

                    });

                }
            });
        }
    })
};

exports.registrarUsuario = (req, res) => {
    if (req.body.nombre === undefined) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo nombre esta vacio',
            data: [],
        });
    }

    if (req.body.cedula === undefined) {
        return res.status(400).json({
            estado: 3,
            msg: 'Campo cedula esta vacio',
            data: [],
        });
    }

    if (req.body.email === undefined) {
        return res.status(400).json({
            estado: 4,
            msg: 'Campo email esta vacio',
            data: [],
        });
    }

    if (req.body.clave === undefined) {
        return res.status(400).json({
            estado: 5,
            msg: 'Campo clave esta vacio',
            data: [],
        });
    }

    if (req.body.nroCuenta === undefined) {
        return res.status(400).json({
            estado: 6,
            msg: 'Campo nroCuenta esta vacio',
            data: [],
        });
    }

    if (req.body.saldo === undefined) {
        return res.status(400).json({
            estado: 7,
            msg: 'Campo saldo esta vacio',
            data: [],
        });
    }

    let usuario = new Usuario();

    bcrypt.hash(req.body.clave, saltRounds, function (err, hash) {
        if (err) return err;

        usuario.clave = hash;
        usuario.nombre = req.body.nombre;
        usuario.cedula = req.body.cedula;
        usuario.email = req.body.email;
        usuario.cuenta = {nroCuenta: req.body.nroCuenta, saldo: req.body.saldo};
        usuario.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    estado: 8,
                    msg: 'Ha ocurrido un error',
                    data: user,
                });

            } else {
                return res.json({
                    estado: 1,
                    msg: 'Usuario registrado de manera correcta',
                    data: user
                })
            }

        })
    });
};

exports.logout = (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.json({
                    estado: 1,
                    msg: 'Deslogueo exitoso',
                    data: []
                });
            }
        })
    }
};

exports.cuenta = (req, res) => {
     let nuevoNumero = req.body.nroCuenta;
    if (req.body.idCuenta === undefined) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo id esta vacio',
            data: [],
        });
    }

    if (req.body.id === undefined) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo id esta vacio',
            data: [],
        });
    }

    if (req.body.nroCuenta === undefined) {
        return res.status(400).json({
            estado: 2,
            msg: 'Campo nroCuenta esta vacio',
            data: [],
        });
    }

    Usuario.findOneAndUpdate({"_id": req.body.id , "cuenta._id": req.body.idCuenta }, {
        $set: {
            "cuenta.$.nroCuenta" : nuevoNumero
        }
    }, {new: true, useFindAndModify: false}, (err, cuenta) => {
        if (err) {
            return res.status(400).json({
                estado: 2,
                msg: err,
                data: cuenta,
            });
        } else {
            return res.json({
                estado: 1,
                msg: 'Actualizacion exitosa',
                data: cuenta
            });
        }
    })
};




