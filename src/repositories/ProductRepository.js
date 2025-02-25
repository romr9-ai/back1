const Product = require('../models/Product'); // Asegúrate de que la ruta sea correcta

const getPaginatedProducts = async (filter, options) => {
  try {
    const products = await Product.paginate(filter, options);
    return products;
  } catch (error) {
    throw new Error(`❌ Error fetching paginated products: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new Error(`❌ Error fetching product by ID: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(`❌ Error creating product: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error(`❌ Error updating product: ${error.message}`);
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw new Error(`❌ Error deleting product: ${error.message}`);
  }
};

module.exports = {
  getPaginatedProducts,
  getById,
  create,
  update,
  delete: deleteProduct,
};