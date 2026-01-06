var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'undefined2026'; // ⬅️ ИЗМЕНЕНО

let db;
MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log('Подключение к базе данных MongoDB установлено');
    
    // Экспортируем db для использования в роутах
    global.db = db;
  })
  .catch((err) => {
    console.error('Ошибка при подключении к базе данных MongoDB', err);
  });

// маршруты
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
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
