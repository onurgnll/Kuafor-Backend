'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CoiffeurNotification extends Model {
    // Diğer modellerle ilişkiler tanımlanabilir
    static associate(models) {
      // CoiffeurNotification ile Coiffeur arasındaki ilişkiyi burada tanımlıyoruz
      CoiffeurNotification.belongsTo(models.Coiffeur, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  CoiffeurNotification.init(
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
      seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING(15000),
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
      modelName: 'CoiffeurNotification',
      tableName: 'CoiffeurNotifications', // Veritabanı tablosunun ismi
      timestamps: true, // createdAt ve updatedAt otomatik olarak yönetilir
    }
  );

  return CoiffeurNotification;
};
