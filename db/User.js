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


var User = sequelize.define('user', {
  userId: { type: Sequelize.STRING, unique: true },
  admin: Sequelize.BOOLEAN,
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name'
  },
  email: { type: Sequelize.STRING, unique: true },
  password: Sequelize.STRING,
  views: Sequelize.INTEGER,
  answered: Sequelize.STRING
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync();

module.exports = User;
