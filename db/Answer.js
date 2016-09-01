var Sequelize = require('sequelize');

// Initialize sequelize database connection
var sequelize = new Sequelize('sumo', 'root', 'sumoadmin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Define Answer table definition
var Answer = sequelize.define('answer', {
  questionId: Sequelize.STRING,
  userId: Sequelize.STRING,
  question: Sequelize.STRING,
  answer: Sequelize.STRING,
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Answer.sync();

module.exports = Answer;
