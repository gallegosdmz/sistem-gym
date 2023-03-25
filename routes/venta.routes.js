const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerVentas, obtenerVenta, crearVenta, editarVenta, eliminarVenta, obtenerNumeroVenta } = require('../controllers/venta');
const { ventaExiste, productoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerVentas);

router.get('/numeroVenta', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerNumeroVenta);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(ventaExiste),
    validarCampos
], obtenerVenta);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    body('numeroVenta', 'El numero de venta tiene que ser númerico').isNumeric(),
    body('subtotal', 'El subtotal tiene que ser númerico').isNumeric(),
    body('cantidad', 'La cantidad tiene que ser númerica').isNumeric(),
    validarCampos
], crearVenta);

router.put('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(ventaExiste),
    body('subtotal', 'El subtotal tiene que ser númerico').isNumeric(),
    body('cantidad', 'La cantidad tiene que ser númerica').isNumeric(),
    validarCampos
], editarVenta);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(ventaExiste),
    validarCampos
], eliminarVenta);

module.exports = router;