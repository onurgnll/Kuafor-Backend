'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReservationTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coiffeurID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Coiffeurs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      type: {

        type: Sequelize.STRING,
      },
      price: {

        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReservationTypes');
  }
};
