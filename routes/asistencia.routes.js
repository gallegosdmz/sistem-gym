const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerAsistencias, obtenerAsistencia, obtenerAsistenciasPasadas, crearAsistencia, eliminarAsistencia } = require('../controllers/asistencia');
const { asistenciaExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerAsistencias);

router.get('/pasada', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerAsistenciasPasadas);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(asistenciaExiste),
    validarCampos
], obtenerAsistencia);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], crearAsistencia);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(asistenciaExiste),
    validarCampos
], eliminarAsistencia);

module.exports = router;