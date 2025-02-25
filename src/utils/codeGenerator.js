const crypto = require('crypto');

const generateUniqueCode = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

module.exports = { generateUniqueCode };
