const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/api/register', validateRegistration, register);
router.post('/api/login', validateLogin, login);

module.exports = router;