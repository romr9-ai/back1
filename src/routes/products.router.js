const express = require('express');
const mongoose = require('mongoose');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/products.service');

const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { id, pid } = req.params;
  if ((id && !mongoose.Types.ObjectId.isValid(id)) || (pid && !mongoose.Types.ObjectId.isValid(pid))) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }
  next();
};

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  console.log('📌 GET /api/products request received');
  try {
    const products = await getProducts();
    console.log('✅ Productos encontrados:', products);
    res.json({ status: 'success', payload: products });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/products/:id - Obtener un producto específico por ID
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/products/:id - Actualizar un producto por ID
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/products/:id - Eliminar un producto por ID
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;