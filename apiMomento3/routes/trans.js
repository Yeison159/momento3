const routerT = require('express').Router();

tranCtrl = require('../controllers/transCtrl');

routerT.route('/').post( (req, res) => {
    tranCtrl.isertarTra(req, res);
});
routerT.route('/movimientos').post( (req, res) => {
    tranCtrl.movimientos(req, res);
});


module.exports = routerT;
