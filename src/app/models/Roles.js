import Sequelize, { Model } from 'sequelize';

class Roles extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.User, { as: 'user' });
  // }
}

export default Roles;
