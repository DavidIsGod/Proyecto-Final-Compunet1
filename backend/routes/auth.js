const express = require('express');
const { registerUser, loginUser } = require('/controllers/authController');

const router = express.Router();

// Registro
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
