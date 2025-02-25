const UserDAO = require('../dao/UserDAO');

class UserRepository {
  async findByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  async findById(id) {
    return await UserDAO.findById(id);
  }

  async create(userData) {
    return await UserDAO.createUser(userData);
  }
}

module.exports = new UserRepository();
