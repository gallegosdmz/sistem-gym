const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerGastos, obtenerGasto, crearGasto, editarGasto, eliminarGasto } = require('../controllers/gasto');
const { gastoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], obtenerGastos);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(gastoExiste),
    validarCampos
], obtenerGasto);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('precio', 'El precio tiene que ser númerico').isNumeric(),
    validarCampos
], crearGasto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(gastoExiste),
    body('precio', 'El precio tiene que ser númerico').isNumeric(),
    validarCampos
], editarGasto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(gastoExiste),
    validarCampos
], eliminarGasto);

module.exports = router;