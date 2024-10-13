'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      District.belongsTo(models.City, {
        foreignKey: 'cityID',
        as: 'city'
      });
    }
  }
  District.init({
    name: DataTypes.STRING,
    cityID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cities', // City tablosunun adı
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'District',
  });
  return District;
};