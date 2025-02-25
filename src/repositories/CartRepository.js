const CartDAO = require('../dao/CartDAO');

class CartRepository {
  async getById(cartId) {
    return await CartDAO.getCartById(cartId);
  }

  async create() {
    return await CartDAO.createCart();
  }

  async addProduct(cartId, productId, quantity = 1) {
    return await CartDAO.addProductToCart(cartId, productId, quantity);
  }

  async update(cartId, products) {
    return await CartDAO.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await CartDAO.updateProductQuantityInCart(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return await CartDAO.removeProductFromCart(cartId, productId);
  }

  async clear(cartId) {
    return await CartDAO.clearCart(cartId);
  }
}

module.exports = new CartRepository();
