'use strict';

const bcrypt = require(`bcrypt`);
const SALT_ROUNDS = 10;

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async add(userData) {
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    userData.password = hash;
    delete userData.repeat;

    const count = await this._User.count();
    userData.admin = count > 0 ? false : true;

    const newUser = await this._User.create(userData);
    return newUser.get();
  }

  async checkUser(user, password) {
    const match = await bcrypt.compare(password, user.password);
    return match;
  }

  async findByEmail(email) {

    const user = await this._User.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}

module.exports = UserService;
