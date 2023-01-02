const { Router } = require('express');
const { body, param } = require('express-validator');
const { login } = require('../controllers/administrador');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

module.exports = router;