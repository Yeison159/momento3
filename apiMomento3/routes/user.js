const router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        estado: 1,
        msg: 'Aplicacioon ingresada con exito',
        data: []
    });
});

userCtrl = require('../controllers/usuarioCtrl');

router.route('/login').post((req , res) => {
    userCtrl.login(req , res);
});

router.route('/user').post((req , res) => {
    userCtrl.registrarUsuario(req, res);
});

router.route('/user/cuenta').put((req , res) => {
    userCtrl.cuenta(req, res);
});

router.route('/logout').get((req , res) => {
    userCtrl.logout(req, res);
});



module.exports = router;
