const { readProducts, writeProducts } = require('../services/products.service');

const getAllProducts = (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
};

const getProductById = (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.pid);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

const addProduct = (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || stock === undefined || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const products = readProducts();
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
  writeProducts(products);
  res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { id, ...updateData } = req.body; // No se permite actualizar el ID
  products[productIndex] = { ...products[productIndex], ...updateData };
  writeProducts(products);

  res.json(products[productIndex]);
};

const deleteProduct = (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  writeProducts(products);

  res.json({ message: 'Product deleted successfully' });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
