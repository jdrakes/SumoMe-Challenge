var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var User = require('./db/User');

/*Routes*/
var routes = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var admin = require('./routes/admin');

/*Application Defined*/
var app = express();

/*Pre Application Settings*/
var sequelize = new Sequelize('sumo', 'root', 'sumoadmin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  };
}

var Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000)
});

var store = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
  expiration: 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
  table: 'Session',
  extendDefaultFields: extendDefaultFields
});

// User.belongsTo(store.sessionModel, {
//   foreignKeyConstraint: true
// });

/*Application Settiings*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*Define Static Resource Routes*/
app.use('/bootstrap', express.static(path.join(__dirname, 'public/bootstrap')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

/*Initiate Sessions Post Static Resource Declarations*/
app.use(session({
  name: 'sumoSession',
  secret: 'keyboard cat',
  store: store,
  resave: false,
  saveUninitialized: false
}));


store.sync();
// sequelize.sync();

/*Set Routes into Application*/
app.use('/', routes);
app.use('/signup', signup);
app.use('/login', login);
app.use('/admin', admin);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//       message: err.message,
//       error: {}
//   });
// });


module.exports = app;
