const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerProveedores, obtenerProveedor, crearProveedor, editarProveedor, eliminarProveedor} = require('../controllers/proveedor');
const { proveedorExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerProveedores);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(proveedorExiste),
    validarCampos
], obtenerProveedor);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('correo', 'El correo es obligatorio').notEmpty(),
    body('correo', 'El correo no es válido').isEmail(),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('direccion', 'La direccion es obligatoria').notEmpty(),
    validarCampos
], crearProveedor);

router.put('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(proveedorExiste),
    body('correo', 'El correo no es válido').isEmail(),
    validarCampos
], editarProveedor);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(proveedorExiste),
    validarCampos
], eliminarProveedor);

module.exports = router;