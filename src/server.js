const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const { readProducts, writeProducts } = require('./services/products.service');

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Rutas de vistas
app.get('/', async (req, res) => {
  const products = readProducts(); // Obtener productos desde el servicio
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = readProducts(); // Obtener productos desde el servicio
  res.render('realTimeProducts', { products });
});

// Configuración de WebSocket
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('newProduct', (product) => {
    const products = readProducts();
    product.id = Date.now().toString(); // Generar ID único
    products.push(product);
    writeProducts(products); // Actualizar archivo JSON
    io.emit('updateProducts', product);
  });

  socket.on('deleteProduct', (productId) => {
    const products = readProducts();
    const updatedProducts = products.filter((p) => p.id !== productId);
    writeProducts(updatedProducts); // Actualizar archivo JSON
    io.emit('updateProducts', { delete: productId });
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
