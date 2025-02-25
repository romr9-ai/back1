require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET, // Usar variable de entorno
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };