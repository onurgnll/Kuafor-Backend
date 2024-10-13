'use strict';

/** @type {import('sequelize-cli').Migration} */

const citiesData = require("../cities.js");

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insert cities
    const cities = await queryInterface.bulkInsert('Cities', citiesData.cities.map(city => ({
      name: city.ad,
      createdAt: new Date(),
      updatedAt: new Date()
    })), { returning: true });

    // Get the inserted city IDs
    const cityIds = cities.map(city => city.id);

    // Prepare districts data
    const districts = citiesData.cities.flatMap((city, index) => 
      city.ilceler.map(districtName => ({
        name: districtName,
        cityID: cityIds[index],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Insert districts
    await queryInterface.bulkInsert('Districts', districts);
  },

  async down (queryInterface, Sequelize) {
    // Revert the changes by deleting all records
    await queryInterface.bulkDelete('Districts', null, {});
    await queryInterface.bulkDelete('Cities', null, {});
  }
};