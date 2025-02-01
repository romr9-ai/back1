const express = require('express');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../services/products.service');

const router = express.Router();

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
router.post('/', async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json({ status: 'success', product: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ GET /api/products/:pid - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await getProductById(req.params.pid);
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ PUT /api/products/:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.pid, req.body);
    res.json({ status: 'success', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    await deleteProduct(req.params.pid);
    res.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
