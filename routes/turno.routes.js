const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerTurnos, obtenerTurno, crearTurno, editarTurno, eliminarTurno } = require('../controllers/turno');
const { turnoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerTurnos);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(turnoExiste),
    validarCampos
], obtenerTurno);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    body('fecha', 'La fecha es obligatoria').notEmpty(),
    validarCampos
], crearTurno);

router.put('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(turnoExiste),
    validarCampos
], editarTurno);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(turnoExiste),
    validarCampos
], eliminarTurno);

module.exports = router;