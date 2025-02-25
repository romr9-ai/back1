const Cart = require('../models/Cart');

class CartDAO {
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Cart not found.");

    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }
}

module.exports = new CartDAO();
