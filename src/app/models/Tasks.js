import Sequelize, { Model } from 'sequelize';

class Tasks extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        department_id: Sequelize.INTEGER,
        description: Sequelize.TEXT,
        status: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }

  // static associations(models) {
  //   this.hasMany(models.Users);
  //   this.hasMany(models.Departments);
  // }
  static associate(models) {
    this.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users',
    });
    this.belongsTo(models.Departments, {
      foreignKey: 'department_id',
      as: 'departments',
    });
  }
}

export default Tasks;
