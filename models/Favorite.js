'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    // Diğer modellerle ilişkiler burada tanımlanabilir
    static associate(models) {
      // Favorite ve User arasındaki ilişki
      Favorite.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
      });

      // Favorite ve Coiffeur arasındaki ilişki
      Favorite.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      modelName: 'Favorite',
      tableName: 'Favorites', // Veritabanı tablosunun adı
      timestamps: true, // createdAt ve updatedAt otomatik olarak yönetilir
    }
  );

  return Favorite;
};
