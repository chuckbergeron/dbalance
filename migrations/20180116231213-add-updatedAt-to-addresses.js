'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'addresses',
        'updatedAt',
        {
          type: Sequelize.DATE,
          allowNull: false
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('addresses', 'updatedAt')
    ]
  }
};
