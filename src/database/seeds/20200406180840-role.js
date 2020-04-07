module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'Administrador',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
