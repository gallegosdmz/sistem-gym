const { Router } = require('express');
const { body, param } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, editarProducto, eliminarProducto } = require('../controllers/producto');
const { productoExiste, categoriaExiste, proveedorExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esEmpleadoRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT,
    esEmpleadoRole,
    validarCampos
], obtenerProductos);

router.get('/:id', [
    validarJWT,
    esEmpleadoRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(productoExiste),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    esEmpleadoRole,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('precio_venta', 'El precio de venta tiene que ser numerico').isNumeric(),
    body('precio_compra', 'El precio de compra tiene que ser numerico').isNumeric(),
    body('stock', 'El stock tiene que ser numerico').isNumeric(),
    body('categoria').custom(categoriaExiste),
    body('proveedor').custom(proveedorExiste),
    validarCampos
], crearProducto);

router.put('/:id', [
     validarJWT,
     esEmpleadoRole,
     param('id', 'El ID no es válido').isMongoId(),
     param('id').custom(productoExiste),
     body('precio_venta', 'El precio de venta tiene que ser numerico').isNumeric(),
     body('precio_compra', 'El precio de compra tiene que ser numerico').isNumeric(),
     body('stock', 'El stock tiene que ser numerico').isNumeric(),
     body('categoria').custom(categoriaExiste),
     body('proveedor').custom(proveedorExiste),
     validarCampos
], editarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El ID no es válido').isMongoId(),
    param('id').custom(productoExiste),
    validarCampos
], eliminarProducto);

module.exports = router;