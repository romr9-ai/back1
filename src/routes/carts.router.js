const express = require('express');
const {
  getCartById,
  createCart,
  addProductToCart,
  updateCart,
  updateProductQuantityInCart,
  removeProductFromCart,
  clearCart,
} = require('../services/carts.service');
const mongoose = require('mongoose');

const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { id, pid } = req.params;
  if ((id && !mongoose.Types.ObjectId.isValid(id)) || (pid && !mongoose.Types.ObjectId.isValid(pid))) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }
  next();
};

// GET /carts/:id - Obtener un carrito específico con productos poblados
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const cart = await getCartById(req.params.id);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /carts - Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /carts/:id - Actualizar carrito con un nuevo array de productos
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const updatedCart = await updateCart(req.params.id, req.body.products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /carts/:id/products/:pid - Actualizar cantidad de un producto en el carrito
router.put('/:id/products/:pid', validateObjectId, async (req, res) => {
  try {
    if (!req.body.quantity || req.body.quantity <= 0) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be greater than zero' });
    }
    const updatedCart = await updateProductQuantityInCart(req.params.id, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /carts/:id/products/:pid - Eliminar un producto específico del carrito
router.delete('/:id/products/:pid', validateObjectId, async (req, res) => {
  try {
    const updatedCart = await removeProductFromCart(req.params.id, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /carts/:id - Vaciar el carrito por completo
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const clearedCart = await clearCart(req.params.id);
    res.json({ status: 'success', payload: clearedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
