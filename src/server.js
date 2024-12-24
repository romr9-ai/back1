const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const {
  readProducts,
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
} = require('./services/products.service');
const cartRoutes = require('./routes/carts.router'); // Rutas para carritos

const app = express();
const PORT = 8080;

// Connect to the database
connectDB();

// Handlebars Configuration
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

// View Routes
app.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const products = await getProducts(Number(limit), Number(page), sort, query); // Productos con filtros, paginación, y ordenamiento
    res.render('home', { products });
  } catch (error) {
    console.error('Error fetching products for home page:', error.message);
    res.status(500).send('Error loading products');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await readProducts(); // Productos en tiempo real
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error fetching products for real-time page:', error.message);
    res.status(500).send('Error loading real-time products');
  }
});

app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await getProductById(pid); // Detalles del producto
    res.render('productDetails', { product });
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);
    res.status(500).send('Error loading product details');
  }
});

// API Routes for carts
app.use('/api/carts', cartRoutes);

// WebSocket Configuration
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('newProduct', async (product) => {
    try {
      const newProduct = await createProduct(product); // Crear producto
      io.emit('updateProducts', newProduct);
      console.log('Product added successfully:', newProduct);
    } catch (error) {
      console.error('Error creating product:', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    console.log('Attempting to delete product with ID:', productId);
    try {
      const result = await deleteProduct(productId); // Eliminar producto
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

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
