'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CoiffeurProperties', {
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
      resActive: {

        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      resStartTime: {

        type: Sequelize.STRING,
      },
      resEndTime: {

        type: Sequelize.STRING,
      },
      employeeCount: {

        type: Sequelize.INTEGER,
      },
      gender: {

        type: Sequelize.STRING,
      },
      pictures: {

        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable('CoiffeurProperties');
  }
};
