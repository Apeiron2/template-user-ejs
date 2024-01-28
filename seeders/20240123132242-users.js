"use strict";
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    for (let index = 0; index < 10; index++) {
      const salt = bcrypt.genSaltSync(10);
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("123456", salt),
        provider: "local",
        status: faker.datatype.boolean(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
