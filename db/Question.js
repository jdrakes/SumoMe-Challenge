var Sequelize = require('sequelize');

var sequelize = new Sequelize('sumo', 'root', 'sumoadmin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});


var Question = sequelize.define('question', {
	questionId: {Sequelize.INTEGER , autoIncrement: true, primaryKey: true},
  question: {
    type: Sequelize.STRING,
    unique: true
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Question.sync();

module.exports = Question;