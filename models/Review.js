'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review ve User arasındaki ilişki
      Review.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
      });

      // Review ve Coiffeur arasındaki ilişki
      Review.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      coiffeurID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Coiffeurs',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      modelName: 'Review',
      tableName: 'Reviews',
      timestamps: true,
    }
  );

  return Review;
};
