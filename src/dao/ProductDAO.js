const Product = require('../models/Product');

class ProductDAO {
  async getPaginatedProducts(filter, options) {
    return await Product.paginate(filter, options);
  }

  async getAllProducts() {
    return await Product.find().lean();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(productData) {
    return await Product.create(productData);
}

  async updateProduct(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductDAO();