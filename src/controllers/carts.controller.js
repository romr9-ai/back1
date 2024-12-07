const { readCarts, writeCarts } = require('../services/carts.service');
const { readProducts } = require('../services/products.service');

const createCart = (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length + 1).toString(),
    products: [],
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
};

const getCartById = (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.json(cart.products);
};

const addProductToCart = (req, res) => {
  const carts = readCarts();
  const products = readProducts();
  const cart = carts.find((c) => c.id === req.params.cid);
  const product = products.find((p) => p.id === req.params.pid);

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const productInCart = cart.products.find((p) => p.product === product.id);
  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: product.id, quantity: 1 });
  }

  writeCarts(carts);
  res.json(cart);
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
