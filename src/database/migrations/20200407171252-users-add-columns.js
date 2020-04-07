module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'deleted_at',
          {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            after: 'password_hash',
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'users',
          'deleted_by',
          {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            after: 'deleted_at',
            references: {
              model: {
                tableName: 'users',
              },
              key: 'id',
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('users', 'deleted_at', { transaction: t }),
        queryInterface.removeColumn('user', 'deleted_by', { transaction: t }),
      ]);
    });
  },
};
