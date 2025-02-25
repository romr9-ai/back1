console.log('sessions.router.js is loaded');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const UserRepository = require('../repositories/UserRepository'); // ✅ Usamos Repository
const { generateToken } = require('../utils/jwt');
const UserDTO = require('../dto/UserDTO'); // ✅ Aplicamos DTO
const { authorizeUser, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ **Registro de usuario**
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await UserRepository.createUser({ first_name, last_name, email, age, password, role });

    res.status(201).json({ message: 'User registered successfully', user: new UserDTO(newUser) });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// ✅ **Login de usuario**
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserRepository.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.cookie('authToken', token, { httpOnly: true }).json({ message: 'Login successful', token, user: new UserDTO(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// ✅ **Logout (elimina la cookie)**
router.post('/logout', (req, res) => {
  res.clearCookie('authToken').json({ message: 'Logged out successfully' });
});

// ✅ **Obtener usuario actual con DTO (protege datos sensibles)**
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 🔹 Usar DTO para ocultar datos sensibles (contraseña, etc.)
    const userDTO = new UserDTO(req.user);

    res.json({ status: 'success', user: userDTO });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current user', error: error.message });
  }
});

// ✅ **Ruta protegida solo para administradores**
router.get('/admin', passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
  res.json({ message: 'Welcome, Admin!', user: new UserDTO(req.user) });
});

module.exports = router;
