'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'addresses',
        'createdAt',
        {
          type: Sequelize.DATE,
          allowNull: false
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('addresses', 'createdAt')
    ]
  }
};
