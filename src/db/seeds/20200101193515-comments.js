'use strict';

const faker = require('faker');

const comments = [];

function getRandomNumber(min, max){
  return Math.random() * (max - min) + min;
}

for(let i = 1 ; i <= 15 ; i++){
  for(let j = 1 ; j <= 10 ; j++){
  
    comments.push({
      body: faker.lorem.sentence(),
      postId: getRandomNumber(1, 15),
      userId: getRandomNumber(1, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Comments", comments, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete("Comments", null, {});
  }
};
