'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    // Diğer modellerle ilişkiler burada tanımlanabilir
    static associate(models) {
      // Reservation ve Coiffeur arasındaki ilişki
      Reservation.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });

      // Reservation ve User arasındaki ilişki
      Reservation.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
      });
    }
  }

  Reservation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      coiffeurID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Coiffeurs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      resTypeIDs: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      totalPrice: {
        type: DataTypes.INTEGER,
      },
      resDate: {
        type: DataTypes.DATE,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
      },
      merchantOid: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      paymentTransactionID: {

        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Reservation',
      tableName: 'Reservations',
      timestamps: true,
    }
  );

  return Reservation;
};
