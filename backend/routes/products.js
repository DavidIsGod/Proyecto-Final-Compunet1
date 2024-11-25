const express = require('express');
const { getProducts, addProduct } = require('/controllers/productController');

const router = express.Router();

// Obtener productos
router.get('/', getProducts);

// Agregar producto
router.post('/', addProduct);

module.exports = router;
