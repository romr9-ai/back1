const mongoose = require('mongoose');
const Product = require('../models/Product');

// Fetch all products from the database
const readProducts = async () => {
  try {
    return await Product.find().lean(); // Use lean() for better performance and compatibility with Handlebars
  } catch (error) {
    throw new Error('Error fetching products from the database');
  }
};

// Fetch products with filters, pagination, and sorting
const getProducts = async (limit, page, sort, query) => {
  const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
  const options = {
    limit,
    page,
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
  };
  return await Product.paginate(filter, options);
};

// Fetch a product by ID
const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Product.findById(id);
};

// Create a new product
const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

// Update an existing product
const updateProduct = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// Delete a product by ID
const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  readProducts,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
