console.log('THIS APP.JS IS RUNNING');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// SESSION с MongoDB
app.use(session({
  secret: 'hotel-secret-key',
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/hotel-site' })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', function(req, res) {
  res.send('APP.JS WORKS');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Rooms routes
const roomRoutes = require('./routes/rooms');
app.use('/rooms', roomRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send(`Ошибка ${err.status || 500}: ${err.message}`);
});

module.exports = app;
