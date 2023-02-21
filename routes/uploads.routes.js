const { Router } = require('express');
const { body, param } = require('express-validator');
const { actualizarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    param('id', 'El id debe ser de mongo').isMongoId(),
    param('coleccion').custom(c => coleccionesPermitidas(c, ['empleados', 'clientes', 'productos'])),
    validarCampos
], actualizarImagen);

module.exports = router;