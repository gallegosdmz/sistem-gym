const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerVentas, obtenerVenta, crearVenta, editarVenta, eliminarVenta } = require('../controllers/venta');
const { ventaExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerVentas);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(ventaExiste),
    validarCampos
], obtenerVenta);

//TODO: TERMINAR RUTAS

module.exports = router;