import Sequelize from 'sequelize';

import Users from '../app/models/Users';
import Departments from '../app/models/Departments';
import Roles from '../app/models/Roles';
import databaseConfig from '../config/database';

const models = [Users, Departments, Roles];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
