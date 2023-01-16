const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerClientes, obtenerCliente, crearCliente, editarCliente, eliminarCliente } = require('../controllers/cliente');
const { clienteExiste, emailExisteCliente, mensualidadExiste, contactoExiste, empleadoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerClientes);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(clienteExiste),
    validarCampos
], obtenerCliente);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'El apellido es obligatorio').notEmpty(),
    body('correo').custom(emailExisteCliente),
    body('password', 'La contraseña debe de ser de más de 6 letra').isLength({min: 6}),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('mensualidad', 'La mensualidad es obligatoria').notEmpty(),
    body('mensualidad').custom(mensualidadExiste),
    body('fecha_pago', 'La fecha no es valida').isDate(),
    body('contacto').custom(contactoExiste),
    body('fecha_nac', 'La fecha no es valida').isDate(),
    validarCampos
], crearCliente);

router.put('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(clienteExiste),
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'El apellido es obligatorio').notEmpty(),
    body('password', 'La contraseña debe de ser de más de 6 letra').isLength({min: 6}),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('mensualidad', 'La mensualidad es obligatoria').notEmpty(),
    body('mensualidad').custom(mensualidadExiste),
    body('fecha_pago', 'La fecha no es valida').isDate(),
    body('contacto').custom(contactoExiste),
    body('fecha_nac', 'La fecha no es valida').isDate(),
    validarCampos
], editarCliente);

router.delete('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(clienteExiste),
    validarCampos
], eliminarCliente);

module.exports = router;