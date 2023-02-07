const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerTurnos, obtenerTurno, crearTurno, editarTurno } = require('../controllers/turno');
const { } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos
], crearTurno);

router.put('/:id', [
    validarJWT,
    validarCampos
], editarTurno);

module.exports = router;