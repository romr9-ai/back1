const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecretkey123'; // Cambia esto por una variable de entorno

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };
