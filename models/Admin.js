'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    // Diğer modellerle ilişkileri tanımlamak için associate metodu kullanılır
    static associate(models) {
      // Örneğin: Admin.hasMany(models.AnotherModel, { foreignKey: 'adminId' });
    }
  }

  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
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
      modelName: 'Admin',
      tableName: 'Admins', // Tablo adını belirtiyoruz
      timestamps: true, // createdAt ve updatedAt sütunlarını otomatik olarak günceller
    }
  );

  return Admin;
};
