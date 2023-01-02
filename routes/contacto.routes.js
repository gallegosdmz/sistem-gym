const { Router } = require('express');
const { body, param } = require('express-validator');
const { crearContacto, obtenerContacto, obtenerContactos, editarContacto, eliminarContacto } = require('../controllers/contacto');
const { contactoExiste } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    validarCampos
], obtenerContactos);

router.get('/:id', [
    validarJWT,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(contactoExiste),
    validarCampos
], obtenerContacto);

router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'Apellido es necesario').notEmpty(),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('parentesco', 'El parentesco es obligatorio').notEmpty(),
    validarCampos
], crearContacto);

router.put('/:id', [
    validarJWT,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(contactoExiste),
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('apellido', 'El apellido es obligatorio').notEmpty(),
    body('telefono', 'El telefono es obligatorio').notEmpty(),
    body('parentesco', 'El parentesco es obligatorio'),
    validarCampos
], editarContacto);

router.delete('/:id', [
    validarJWT,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(contactoExiste),
    validarCampos
], eliminarContacto);

module.exports = router;