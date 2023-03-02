const { Router } = require('express');
const { body, param } = require('express-validator');
const { generarReporteDiario } = require('../controllers/ganancia');
const {  } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], generarReporteDiario);

module.exports = router;