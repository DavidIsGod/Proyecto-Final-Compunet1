const express = require('express');
const { authenticateToken } = require('/middleware/authMiddleware');

const router = express.Router();

// Ruta protegida
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Ruta protegida', user: req.user });
});

module.exports = router;
