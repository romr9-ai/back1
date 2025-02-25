const express = require('express');
const mongoose = require('mongoose');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../services/products.service');

const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { pid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: 'error', message: 'Invalid product ID format' });
  }
  next();
};

// Middleware para validar el cuerpo de los productos
const validateProductBody = (req, res, next) => {
  const { title, description, code, price, stock, category } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: title, description, code, price, stock, category',
    });
  }
  next();
};

// ✅ GET /api/products - Obtener productos con paginación y filtros
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const products = await getProducts(Number(limit), Number(page), sort, query);
    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ POST /api/products - Agregar nuevo producto
router.post('/', validateProductBody, async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json({ status: 'success', product: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ GET /api/products/:pid - Obtener un producto por ID
router.get('/:pid', validateObjectId, async (req, res) => {
  try {
    const product = await getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ PUT /api/products/:pid - Actualizar producto
router.put('/:pid', validateObjectId, validateProductBody, async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.pid, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', validateObjectId, async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;