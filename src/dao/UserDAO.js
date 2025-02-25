const User = require('../models/User'); // 
const bcrypt = require('bcrypt');

class UserDAO {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async createUser({ first_name, last_name, email, age, password }) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: 'user',
    });

    return await newUser.save();
  }
}

module.exports = new UserDAO();