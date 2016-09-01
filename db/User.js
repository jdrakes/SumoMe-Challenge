var Sequelize = require('sequelize');

// Initialize sequelize database connection
var sequelize = new Sequelize('sumo', 'root', 'sumoadmin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: { max: 5, min: 0, idle: 10000 }
});

// Define User table definition
var User = sequelize.define('user', {
  userId: { type: Sequelize.STRING, unique: true },
  admin: Sequelize.BOOLEAN,
  firstName: { type: Sequelize.STRING, field: 'first_name' },
  lastName: { type: Sequelize.STRING, field: 'last_name' },
  email: { type: Sequelize.STRING, unique: true },
  displayName: { type: Sequelize.STRING, unique: true, field: 'display_name' },
  password: Sequelize.STRING,
  views: Sequelize.INTEGER,
  answered: Sequelize.STRING
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync();

module.exports = User;
