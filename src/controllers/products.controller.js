// src/controllers/products.controller.js
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const getAllProducts = (req, res) => {
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    const products = JSON.parse(data);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
  });
};

const getProductById = (req, res) => {
  const productId = req.params.pid;
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
};

const addProduct = (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || stock === undefined || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    const products = JSON.parse(data);
    const newProduct = {
      id: (products.length + 1).toString(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving product' });
      }
      res.status(201).json(newProduct);
    });
  });
};

const updateProduct = (req, res) => {
  const productId = req.params.pid;
  const updateData = req.body;
  if (updateData.id) {
    return res.status(400).json({ message: 'ID cannot be updated' });
  }
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products[productIndex] = { ...products[productIndex], ...updateData };
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating product' });
      }
      res.json(products[productIndex]);
    });
  });
};

const deleteProduct = (req, res) => {
  const productId = req.params.pid;
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(productIndex, 1);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting product' });
      }
      res.status(204).send();
    });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
