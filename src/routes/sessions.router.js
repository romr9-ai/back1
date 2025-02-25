console.log('sessions.router.js is loaded');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const UserDAO = require('../dao/UserDAO'); // ✅ Ruta correcta
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// **Registro de usuario**
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await UserDAO.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await UserDAO.createUser({ first_name, last_name, email, age, password });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// **Login de usuario**
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserDAO.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.cookie('authToken', token, { httpOnly: true }).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// **Logout (elimina la cookie)**
router.post('/logout', (req, res) => {
  res.clearCookie('authToken').json({ message: 'Logged out successfully' });
});

// **Obtener usuario actual con JWT**
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Recargar usuario desde la base de datos para evitar errores en req.user
    const user = await UserDAO.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current user', error: error.message });
  }
});

module.exports = router;