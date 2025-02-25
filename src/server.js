require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Importar rutas
const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/carts.router');
const sessionRoutes = require('./routes/sessions.router');

require('./config/passport'); // Configuración de Passport

const app = express();
const PORT = process.env.PORT || 8080; // Usa el puerto de .env o 8080 por defecto

// **Conectar a la base de datos**
connectDB();

// **Configuración de Handlebars**
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

// **Middleware**
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
  console.log('🟢 Nuevo cliente conectado');

  socket.on('newProduct', async (product) => {
    try {
      const newProduct = await createProduct(product);
      io.emit('updateProducts', newProduct);
      console.log('✅ Producto agregado:', newProduct);
    } catch (error) {
      console.error('❌ Error creando producto:', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    console.log('🗑️ Eliminando producto con ID:', productId);
    try {
      const result = await deleteProduct(productId);
      if (result) {
        io.emit('updateProducts', { delete: productId });
        console.log('✅ Producto eliminado:', productId);
      } else {
        console.error('⚠️ No se encontró el producto con ID:', productId);
      }
    } catch (error) {
      console.error('❌ Error eliminando producto:', error.message);
    }
  });
});

// **Iniciar el servidor**
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});