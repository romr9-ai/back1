// src/controllers/carts.controller.js
const fs = require('fs');
const path = require('path'); // Import 'path'

const cartsFilePath = path.join(__dirname, '../data/carts.json');

const createCart = (req, res) => {
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading carts data' });
    }
    const carts = JSON.parse(data);
    const newCart = {
      id: (carts.length + 1).toString(),
      products: [],
    };
    carts.push(newCart);
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving cart' });
      }
      res.status(201).json(newCart);
    });
  });
};

const getCartById = (req, res) => {
  const cartId = req.params.cid;
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading carts data' });
    }
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart.products);
  });
};

const addProductToCart = (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading carts data' });
    }
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((c) => c.id === cartId);
    if (cartIndex === -1) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const productIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);
    if (productIndex === -1) {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    } else {
      carts[cartIndex].products[productIndex].quantity += 1;
    }
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating cart' });
      }
      res.status(200).json(carts[cartIndex]);
    });
  });
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
