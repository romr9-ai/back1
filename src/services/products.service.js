const mongoose = require('mongoose');
const ProductRepository = require('../repositories/ProductRepository');

const getProducts = async (limit = 10, page = 1, sort, query) => {
  try {
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
    const options = {
      limit: Number(limit),
      page: Number(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };
    return await ProductRepository.getPaginatedProducts(filter, options);
  } catch (error) {
    throw new Error(`❌ Error fetching paginated products: ${error.message}`);
  }
};

const getProductById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }
    return await ProductRepository.getById(id);
  } catch (error) {
    throw new Error(`❌ Error fetching product by ID: ${error.message}`);
  }
};

const createProduct = async (data) => {
  try {
    console.log("📌 Data recibida en createProduct:", data);

    const { title, description, price, stock, category, code } = data;

    if (!title || !description || !price || !stock || !category || !code) {
      throw new Error('⚠️ Missing required fields: title, description, price, stock, category, code');
    }

    return await ProductRepository.create(data);
  } catch (error) {
    throw new Error(`❌ Error creating product: ${error.message}`);
  }
};

const updateProduct = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }
    return await ProductRepository.update(id, data);
  } catch (error) {
    throw new Error(`❌ Error updating product: ${error.message}`);
  }
};

const deleteProduct = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }
    return await ProductRepository.delete(id);
  } catch (error) {
    throw new Error(`❌ Error deleting product: ${error.message}`);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};