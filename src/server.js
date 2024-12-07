const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http'); // Para crear el servidor HTTP
const { router: productsRouter, setSocket } = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

const app = express();
const PORT = 8080;

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Real-Time Products' });
});

// Crear servidor HTTP y configurar WebSocket
const server = http.createServer(app);
const io = new Server(server);

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escucha los eventos de productos
  socket.on('newProduct', (product) => {
    console.log('Nuevo producto recibido:', product);
    io.emit('updateProducts', product); // Actualiza la lista de productos en tiempo real
  });

  socket.on('deleteProduct', (productId) => {
    console.log('Producto eliminado con ID:', productId);
    io.emit('updateProducts', { delete: productId }); // Notifica a los clientes que se eliminó un producto
  });
});

// Pasar el servidor WebSocket a las rutas
setSocket(io);

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
