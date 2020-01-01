'use strict';

const faker = require('faker');

const posts = [];

function getRandomUserId(min, max){
  return Math.random() * (max - min) + min;
}

for(let i = 1 ; i <= 15 ; i++){
  for(let j = 1 ; j <= 10 ; j++){
  
    posts.push({
      title: faker.hacker.phrase(),
      body: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
      topicId: i,
      userId: getRandomUserId(1, 15)
    
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
   return queryInterface.bulkInsert("Posts", posts, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete("Posts", null, {});
  }
};
