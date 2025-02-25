const mongoose = require('mongoose');
const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const TicketRepository = require('../repositories/TicketRepository');
const { generateUniqueCode } = require('../utils/codeGenerator');

const getCartById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid cart ID format');
  }
  return await CartRepository.getById(id);
};

const createCart = async () => {
  return await CartRepository.create();
};

const addProductToCart = async (cartId, productId, quantity = 1) => {
  if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid ID format');
  }
  return await CartRepository.addProduct(cartId, productId, quantity);
};

const updateCart = async (cartId, products) => {
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new Error('Invalid cart ID format');
  }
  return await CartRepository.update(cartId, products);
};

const updateProductQuantityInCart = async (cartId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid ID format');
  }
  return await CartRepository.updateProductQuantity(cartId, productId, quantity);
};

const removeProductFromCart = async (cartId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid ID format');
  }
  return await CartRepository.removeProduct(cartId, productId);
};

const clearCart = async (cartId) => {
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new Error('Invalid cart ID format');
  }
  return await CartRepository.clear(cartId);
};

// 
const purchaseCart = async (cartId, purchaserEmail) => {
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new Error('Invalid cart ID format');
  }

  // Obtener el carrito
  const cart = await CartRepository.getById(cartId);
  if (!cart || cart.products.length === 0) {
    throw new Error('Cart is empty or does not exist');
  }

  let totalAmount = 0;
  const purchasedProducts = [];
  const failedProducts = [];

  for (const item of cart.products) {
    const product = await ProductRepository.getById(item.product);
    if (product && product.stock >= item.quantity) {
      // ✅ Restar stock del producto y sumar al total de la compra
      product.stock -= item.quantity;
      await ProductRepository.update(product._id, { stock: product.stock });

      totalAmount += product.price * item.quantity;
      purchasedProducts.push(product._id);
    } else {
      // 🔴 Producto sin stock suficiente
      failedProducts.push(product._id);
    }
  }

  // ✅ Generar el ticket solo si se compró al menos un producto
  if (purchasedProducts.length > 0) {
    const ticketData = {
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: purchaserEmail,
    };

    await TicketRepository.create(ticketData);
  }

  // ✅ Actualizar carrito con los productos no comprados
  cart.products = cart.products.filter(item => failedProducts.includes(item.product));
  await CartRepository.update(cartId, cart.products);

  return {
    status: 'success',
    purchased: purchasedProducts,
    notPurchased: failedProducts.length > 0 ? failedProducts : null,
  };
};

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  updateCart,
  updateProductQuantityInCart,
  removeProductFromCart,
  clearCart,
  purchaseCart, // 
};
