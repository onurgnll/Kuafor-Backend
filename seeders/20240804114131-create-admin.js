'use strict';

const { cryptPassword } = require("../helpers/cryptPassword");
require("dotenv").config();
module.exports = {
  async up(queryInterface, Sequelize) {

    const password = await cryptPassword(process.env.ADMIN_PASSWORD)
    await queryInterface.bulkInsert('Admins', [
      {
        accessToken: null,
        refreshToken: null,
        email: 'admin@admin.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  }
};