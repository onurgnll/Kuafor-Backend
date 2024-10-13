'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CoiffeurNotifications', {
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
      seen: {

        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      title: {

        type: Sequelize.STRING,
      },
      content: {

        type: Sequelize.STRING(15000),
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
    await queryInterface.dropTable('CoiffeurNotifications');
  }
};
