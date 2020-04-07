import Sequelize, { Model } from 'sequelize';

class Departments extends Model {
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

  verifyPermission(req, res, next) {
    if (req.roleId !== 1) {
      return res.status(401).json({ error: 'unauthorized user' });
    }
    return next();
  }
}

export default Departments;
