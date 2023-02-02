const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerCategorias, obtenerCategoria, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoria');
const { categoriaExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], obtenerCategorias);

router.get('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(categoriaExiste),
    validarCampos
], obtenerCategoria);

router.post('/', [
    validarJWT,
    esAdminRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(categoriaExiste),
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], editarCategoria);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(categoriaExiste),
    validarCampos
], eliminarCategoria);

module.exports = router;