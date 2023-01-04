const { Router } = require('express');
const { body, param } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { login, renovarToken } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.get('/', validarJWT, renovarToken);

module.exports = router;