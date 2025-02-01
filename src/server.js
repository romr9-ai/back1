const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const productRoutes = require('./routes/products.router'); // Rutas de productos
const cartRoutes = require('./routes/carts.router'); // Rutas de carritos
const sessionRoutes = require('./routes/sessions.router');




require('./config/passport'); // Configuración de Passport

const app = express();
const PORT = 8080;

// Conectar a la base de datos
connectDB();

// Configuración de Handlebars
app.engine(
  'handlebars',
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(passport.initialize());

// **Rutas de API**
app.use('/api/sessions', sessionRoutes); // Manejo de usuarios y JWT
app.use('/api/products', productRoutes); // Productos con paginación y filtros
app.use('/api/carts', cartRoutes); // Carritos y compras

// **Vistas con Handlebars**
app.get('/', async (req, res) => {
  try {
    res.render('home'); // Renderiza la página principal
  } catch (error) {
    console.error('Error rendering home page:', error.message);
    res.status(500).send('Error loading home page');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    res.render('realTimeProducts'); // Renderiza productos en tiempo real con WebSockets
  } catch (error) {
    console.error('Error rendering real-time products page:', error.message);
    res.status(500).send('Error loading real-time products page');
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    res.render('productDetails'); // Renderiza los detalles de un producto
  } catch (error) {
    console.error('Error rendering product details page:', error.message);
    res.status(500).send('Error loading product details page');
  }
});

// **WebSockets para productos en tiempo real**
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('newProduct', async (product) => {
    try {
      const newProduct = await createProduct(product);
      io.emit('updateProducts', newProduct);
      console.log('Product added successfully:', newProduct);
    } catch (error) {
      console.error('Error creating product:', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    console.log('Attempting to delete product with ID:', productId);
    try {
      const result = await deleteProduct(productId);
      if (result) {
        io.emit('updateProducts', { delete: productId });
        console.log('Product deleted successfully:', productId);
      } else {
        console.error('No product found with ID:', productId);
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
