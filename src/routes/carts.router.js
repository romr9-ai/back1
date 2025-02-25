const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const CartRepository = require('../repositories/CartRepository'); // ✅ Asegurar que el import es correcto
const { authorizeUser, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { id, pid } = req.params;
  if ((id && !mongoose.Types.ObjectId.isValid(id)) || (pid && !mongoose.Types.ObjectId.isValid(pid))) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }
  next();
};

// ✅ **Obtener un carrito específico**
router.get('/:id', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
  try {
    const cart = await CartRepository.getById(req.params.id);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Crear un nuevo carrito**
router.post('/', async (req, res) => {
  try {
    const newCart = await CartRepository.create();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Agregar un producto al carrito (Solo usuarios)**
router.post('/:id/products/:pid', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
  try {
    const updatedCart = await CartRepository.addProduct(req.params.id, req.params.pid, req.body.quantity || 1);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error("❌ Error en addProductToCart:", error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Actualizar carrito completo (Solo admins)**
router.put('/:id', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
  try {
    const updatedCart = await CartRepository.update(req.params.id, req.body.products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Actualizar cantidad de un producto en el carrito (Solo usuarios)**
router.put('/:id/products/:pid', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
  try {
    if (!req.body.quantity || req.body.quantity <= 0) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be greater than zero' });
    }
    const updatedCart = await CartRepository.updateProductQuantity(req.params.id, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Eliminar un producto del carrito (Solo usuarios)**
router.delete('/:id/products/:pid', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
  try {
    const updatedCart = await CartRepository.removeProduct(req.params.id, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ **Vaciar el carrito (Solo admins)**
router.delete('/:id', validateObjectId, passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
  try {
    const clearedCart = await CartRepository.clear(req.params.id);
    res.json({ status: 'success', payload: clearedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;