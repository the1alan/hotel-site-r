const { MongoClient } = require('mongodb');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup (по пособию)
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных
const url = 'mongodb://localhost:27017';
const dbName = 'hotelDB'; // Название базы данных

let db;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log('Подключение к базе данных MongoDB установлено');
  })
  .catch((err) => {
    console.error('Ошибка при подключении к базе данных MongoDB', err);
  });


// маршруты
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Гостевой дом у Рузанны' });
});

module.exports = app;
