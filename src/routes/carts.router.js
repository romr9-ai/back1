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

const router = express.Router();

// GET /carts/:id - Get a specific cart with populated products
router.get('/:id', async (req, res) => {
  try {
    const cart = await getCartById(req.params.id);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /carts - Create a new cart
router.post('/', async (req, res) => {
  try {
    const newCart = await createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /carts/:id - Update cart with a new array of products
router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await updateCart(req.params.id, req.body.products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /carts/:id/products/:pid - Update the quantity of a specific product in a cart
router.put('/:id/products/:pid', async (req, res) => {
  try {
    const updatedCart = await updateProductQuantityInCart(req.params.id, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /carts/:id/products/:pid - Remove a specific product from the cart
router.delete('/:id/products/:pid', async (req, res) => {
  try {
    const updatedCart = await removeProductFromCart(req.params.id, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /carts/:id - Remove all products from the cart
router.delete('/:id', async (req, res) => {
  try {
    const clearedCart = await clearCart(req.params.id);
    res.json({ status: 'success', payload: clearedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
