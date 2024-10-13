'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
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
      reservationID: {

        type: Sequelize.INTEGER,
        references: {
          model: 'Reservations',
          key: 'id',
        },
        allowNull: true,
        onDelete: 'CASCADE',
      },
      totalPrice: {

        type: Sequelize.INTEGER,
      },
      status: {

        type: Sequelize.STRING,
      },
      merchantOid: {

        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Payments');
  }
};
