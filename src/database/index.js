import Sequelize from 'sequelize';
import Department from '../app/models/Departments';
import databaseConfig from '../config/database';

const models = [Department];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
