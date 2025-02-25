const CartDAO = require('../dao/CartDAO');

const getCartById = async (id) => {
  return await CartDAO.getCartById(id);
};

const createCart = async () => {
  return await CartDAO.createCart();
};

const addProductToCart = async (cartId, productId) => {
  return await CartDAO.addProductToCart(cartId, productId);
};

const updateCart = async (cartId, products) => {
  return await CartDAO.updateCart(cartId, products);
};

const updateProductQuantityInCart = async (cartId, productId, quantity) => {
  return await CartDAO.updateProductQuantityInCart(cartId, productId, quantity);
};

const removeProductFromCart = async (cartId, productId) => {
  return await CartDAO.removeProductFromCart(cartId, productId);
};

const clearCart = async (cartId) => {
  return await CartDAO.clearCart(cartId);
};

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  updateCart,
  updateProductQuantityInCart,
  removeProductFromCart,
  clearCart,
};