'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReservationType extends Model {
    static associate(models) {
      // ReservationType ve Coiffeur arasındaki ilişki
      ReservationType.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  ReservationType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'ReservationType',
      tableName: 'ReservationTypes',
      timestamps: true,
    }
  );

  return ReservationType;
};
