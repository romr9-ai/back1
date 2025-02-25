const mongoose = require('mongoose');
const Cart = require('../models/Cart'); // 

class CartDAO {
  async getCartById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid cart ID format');
    }
    return await Cart.findById(id).populate('products.product');
  }

  async createCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async addProductToCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid ID format');
    }

    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    return await cart.save();
  }

  async updateCart(cartId, products) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('Invalid cart ID format');
    }

    return await Cart.findByIdAndUpdate(cartId, { products }, { new: true }).populate('products.product');
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid ID format');
    }

    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error('Product not found in the cart');
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid ID format');
    }

    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((p) => p.product.toString() !== productId);

    return await cart.save();
  }

  async clearCart(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('Invalid cart ID format');
    }

    const cart = await Cart.findById(cartId);
    cart.products = []; // Clear all products
    return await cart.save();
  }
}

module.exports = new CartDAO();