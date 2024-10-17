'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservations', {
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
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      resTypeIDs: {

        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      totalPrice: {

        type: Sequelize.INTEGER,
      },
      resDate: {

        type: Sequelize.DATE,
      },
      isApproved: {

        type: Sequelize.BOOLEAN,
      },
      merchantOid: {

        type: Sequelize.STRING,
      },
      status: {

        type: Sequelize.STRING,
      },
      paymentTransactionID: {

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
    await queryInterface.dropTable('Reservations');
  }
};
