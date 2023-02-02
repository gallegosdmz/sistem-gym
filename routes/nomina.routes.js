const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerNominas, obtenerNomina, crearNomina, editarNomina, eliminarNomina } = require('../controllers/nomina');
const { nominaExiste, nominaPagada } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], obtenerNominas);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(nominaExiste),
    validarCampos
], obtenerNomina);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('sueldo_base', 'El sueldo base es obligatorio').notEmpty(),
    body('sueldo_base', 'El sueldo tiene que ser numerico').isNumeric(),
    body('horas_extra', 'La horas extra tienen que ser numericas').isNumeric(),
    body('precio_horas', 'El precio de las horas tiene que ser numerico').isNumeric(),
    body('total_horas', 'El total de horas tiene que ser numerico').isNumeric(),
    body('bono_transporte', 'El bono de transporte tiene que ser numerico').isNumeric(),
    body('total_asignaciones', 'El total de asignaciones tiene que ser numerico').isNumeric(),
    body('adelanto_sueldo', 'El adelanto de sueldo tiene que ser numerico').isNumeric(),
    body('sueldo_bruto', 'El sueldo bruto es obligatorio').notEmpty(),
    body('sueldo_bruto', 'El sueldo bruto tiene que ser numerico').isNumeric(),
    body('isr', 'El ISR es obligatorio').notEmpty(),
    body('isr', 'El ISR tiene que ser numerico').isNumeric(),
    body('sueldo_neto', 'El sueldo neto es obligatorio').notEmpty(),
    body('sueldo_neto', 'El sueldo neto es numerico').isNumeric(),
    validarCampos
], crearNomina);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(nominaExiste),
    param('id').custom(nominaPagada),
    body('sueldo_base', 'El sueldo tiene que ser numerico').isNumeric(),
    body('horas_extra', 'La horas extra tienen que ser numericas').isNumeric(),
    body('precio_horas', 'El precio de las horas tiene que ser numerico').isNumeric(),
    body('total_horas', 'El total de horas tiene que ser numerico').isNumeric(),
    body('bono_transporte', 'El bono de transporte tiene que ser numerico').isNumeric(),
    body('total_asignaciones', 'El total de asignaciones tiene que ser numerico').isNumeric(),
    body('adelanto_sueldo', 'El adelanto de sueldo tiene que ser numerico').isNumeric(),
    body('sueldo_bruto', 'El sueldo bruto tiene que ser numerico').isNumeric(),
    body('isr', 'El ISR tiene que ser numerico').isNumeric(),
    body('sueldo_neto', 'El sueldo neto es numerico').isNumeric(),
    validarCampos
], editarNomina);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(nominaExiste),
    validarCampos
], eliminarNomina);

module.exports = router;