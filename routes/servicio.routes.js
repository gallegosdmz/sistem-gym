const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerServicios, obtenerServicio, crearServicio, editarServicio, eliminarServicio } = require('../controllers/servicio');
const { servicioExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], obtenerServicios);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(servicioExiste),
    validarCampos
], obtenerServicio);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('fecha_pago', 'La fecha de pago es obligatoria').notEmpty(),
    body('fecha_pago', 'La fecha no es válida').isDate(),
    body('precio', 'El precio es obligatorio').notEmpty(),
    body('precio', 'El precio tiene que ser numerico').isNumeric(),
    body('company', 'La compañia es obligatoria').notEmpty(),
    validarCampos
], crearServicio);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(servicioExiste),
    body('fecha_pago', 'La fecha no es válida').isDate(),
    body('precio', 'El precio tiene que ser numerico').isNumeric(),
    validarCampos
], editarServicio);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(servicioExiste),
    validarCampos
], eliminarServicio);

module.exports = router;