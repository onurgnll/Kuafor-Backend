'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coiffeurs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ownerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ownerSurname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iban: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalPoint: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iyzicoExternalID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accessToken: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      refreshToken: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      iyzicoMerchantID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
      },
      cityID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cities',
          key: 'id',
        },
        allowNull: false,
      },
      districtID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Districts',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Coiffeurs');
  },
};
