'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    // Diğer modellerle ilişkiler burada tanımlanabilir
    static associate(models) {
      // Payment ve Coiffeur arasındaki ilişki
      Payment.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });

      // Payment ve Reservation arasındaki ilişki
      Payment.belongsTo(models.Reservation, {
        foreignKey: 'reservationID',
        onDelete: 'CASCADE',
      });
    }
  }

  Payment.init(
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
      reservationID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Reservations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      totalPrice: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
      },
      merchantOid: {
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
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: true,
    }
  );

  return Payment;
};
