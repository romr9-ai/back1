const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');

// Aquí conecta el servidor io (configurado en server.js)
let io;
function setSocket(serverIo) {
  io = serverIo;
}

// Ruta para agregar un producto
router.post('/', (req, res) => {
  const { title, price } = req.body;
  const newProduct = { id: Date.now(), title, price };

  // Emite el evento a través de WebSocket
  io.emit('updateProducts', newProduct);

  res.status(201).json(newProduct);
});

// Ruta para eliminar un producto
router.delete('/:id', (req, res) => {
  const productId = req.params.id;

  // Emite el evento a través de WebSocket
  io.emit('updateProducts', { delete: productId });

  res.status(200).json({ message: 'Product deleted', id: productId });
});

module.exports = { router, setSocket };
