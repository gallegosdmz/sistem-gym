const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerMensualidades, obtenerMensualidad, crearMensualidad, editarMensualidad, eliminarMensualidad } = require('../controllers/mensualidad');
const { mensualidadExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerMensualidades);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(mensualidadExiste),
    validarCampos
], obtenerMensualidad);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('tipo', 'El tipo es obligatorio').notEmpty(),
    body('precio', 'El precio tiene que ser numerico').isNumeric(),
    validarCampos
], crearMensualidad);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(mensualidadExiste),
    body('precio', 'El precio tiene que ser numerico').isNumeric(),
    validarCampos
], editarMensualidad);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(mensualidadExiste),
    validarCampos
], eliminarMensualidad);

module.exports = router