'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CoiffeurProperty extends Model {
    static associate(models) {
      // CoiffeurProperty ile Coiffeur modeli arasındaki ilişki
      CoiffeurProperty.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  CoiffeurProperty.init(
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
      resActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resStartTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resEndTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      employeeCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pictures: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
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
      modelName: 'CoiffeurProperty',
      tableName: 'CoiffeurProperties',
      timestamps: true,
    }
  );

  return CoiffeurProperty;
};
