'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Coiffeur extends Model {
    // Diğer modellerle ilişkiler burada tanımlanabilir
    static associate(models) {
      // Coiffeur ve City ilişkisi
      Coiffeur.belongsTo(models.City, {
        foreignKey: 'cityID',
      });
      
      // Coiffeur ve District ilişkisi
      Coiffeur.belongsTo(models.District, {
        foreignKey: 'districtID',
      });

      // Coiffeur ve CoiffeurNotification ilişkisi
      Coiffeur.hasMany(models.CoiffeurNotification, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
      // Coiffeur ve CoiffeurNotification ilişkisi
      Coiffeur.hasOne(models.CoiffeurProperty, {
        foreignKey: 'coiffeurID',
        onDelete: 'CASCADE',
      });
    }
  }

  Coiffeur.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerSurname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ownerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iban: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iyzicoExternalID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iyzicoMerchantID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
      },
      cityID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id',
        },
      },
      districtID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Districts',
          key: 'id',
        },
      },
      totalPoint: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING(1000),
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
      modelName: 'Coiffeur',
      tableName: 'Coiffeurs', // Veritabanı tablosunun adı
      timestamps: true, // createdAt ve updatedAt otomatik olarak yönetilir
    }
  );

  return Coiffeur;
};
