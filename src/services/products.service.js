const mongoose = require('mongoose');
const ProductDAO = require('../dao/ProductDAO'); // ✅ Asegúrate de que la ruta sea correcta

// Obtener productos con filtros, paginación y ordenamiento
const getProducts = async (limit = 10, page = 1, sort, query) => {
  try {
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
    const options = {
      limit: Number(limit),
      page: Number(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };
    return await ProductDAO.getPaginatedProducts(filter, options);
  } catch (error) {
    throw new Error(`❌ Error fetching paginated products: ${error.message}`);
  }
};

// Obtener todos los productos sin filtros (solo para vistas)
const readProducts = async () => {
  try {
    return await ProductDAO.getAllProducts();
  } catch (error) {
    throw new Error(`❌ Error fetching products: ${error.message}`);
  }
};

// Obtener un producto por ID
const getProductById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }
    return await ProductDAO.getProductById(id);
  } catch (error) {
    throw new Error(`❌ Error fetching product by ID: ${error.message}`);
  }
};

// Crear un nuevo producto
const createProduct = async (data) => {
  try {
    console.log("📌 Data recibida en createProduct:", data);  // ✅ Depuración

    const { title, description, price, stock, category, code } = data;

    // ✅ Verificar que los campos requeridos existan
    if (!title || !description || !price || !stock || !category || !code) {
      throw new Error('⚠️ Missing required fields: title, description, price, stock, category, code');
    }

    return await ProductDAO.createProduct(data);
  } catch (error) {
    throw new Error(`❌ Error creating product: ${error.message}`);
  }
};

// Actualizar un producto existente
const updateProduct = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }

    return await ProductDAO.updateProduct(id, data);
  } catch (error) {
    throw new Error(`❌ Error updating product: ${error.message}`);
  }
};

// Eliminar un producto por ID
const deleteProduct = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('⚠️ Invalid product ID format');
    }

    return await ProductDAO.deleteProduct(id);
  } catch (error) {
    throw new Error(`❌ Error deleting product: ${error.message}`);
  }
};

module.exports = {
  readProducts,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};