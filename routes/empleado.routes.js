const { Router } = require('express');
const { body, param } = require('express-validator');
const { crearEmpleado, obtenerEmpleados, login, editarEmpleado, obtenerEmpleado, eliminarEmpleado } = require('../controllers/empleado');
const { emailExisteEmpleado, curpExiste, rfcExiste, contactoExiste, empleadoExiste, esRoleValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], obtenerEmpleados);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(empleadoExiste),
    validarCampos
], obtenerEmpleado);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'El apellido es obligatorio').notEmpty(),
    body('correo', 'El correo no es válido').isEmail(),
    body('correo').custom(emailExisteEmpleado),
    body('password', 'La contraseña debe ser de más de 6 letras').isLength({min: 6}),
    body('curp', 'La curp es obligatoria').notEmpty(),
    body('curp').custom(curpExiste),
    body('rfc', 'El rfc es obligatorio').notEmpty(),
    body('rfc').custom(rfcExiste),
    body('lugar_nacimiento', 'El lugar de nacimiento es obligatorio').notEmpty(),
    body('sexo', 'El sexo es obligatorio').notEmpty(),
    body('estado_civil', 'El estado civil es obligatorio').notEmpty(),
    body('fecha_nac', 'La fecha de nacimiento es obligatoria').notEmpty(),
    body('fecha_nac', 'La fecha no es valida').isDate(),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('direccion', 'La direccion es obligatoria').notEmpty(),
    body('rol').custom(esRoleValido),
    body('contacto', 'El contacto es obligatorio').notEmpty(),
    body('contacto').custom(contactoExiste),
    validarCampos
], crearEmpleado);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(empleadoExiste),
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'El apellido es obligatorio').notEmpty(),
    body('correo', 'El correo no es válido').isEmail(),
    body('password', 'La contraseña debe ser de más de 6 letras').isLength({min: 6}),
    body('curp', 'La curp es obligatoria').notEmpty(),
    body('rfc', 'El rfc es obligatorio').notEmpty(),
    body('lugar_nacimiento', 'El lugar de nacimiento es obligatorio').notEmpty(),
    body('sexo', 'El sexo es obligatorio').notEmpty(),
    body('estado_civil', 'El estado civil es obligatorio').notEmpty(),
    body('fecha_nac', 'La fecha de nacimiento es obligatoria').notEmpty(),
    body('fecha_nac', 'La fecha no es valida').isDate(),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('direccion', 'La direccion es obligatoria').notEmpty(),
    body('rol').custom(esRoleValido),
    body('contacto', 'El contacto es obligatorio').notEmpty(),
    body('contacto').custom(contactoExiste),
    validarCampos
], editarEmpleado);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(empleadoExiste),
    validarCampos
], eliminarEmpleado);

module.exports = router;