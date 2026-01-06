var express = require('express');
var router = express.Router();

/* Главная страница гостиницы */
router.get('/', function(req, res, next) {
  res.send('<h1>Гостиница Undefined</h1>');
});

/* Страница номеров */
router.get('/rooms', function(req, res, next) {
  res.send('<h1>Номера гостиницы Undefined</h1>');
});

/* Страница контактов */
router.get('/contacts', function(req, res, next) {
  res.send('<h1>Контакты гостиницы Undefined</h1>');
});

module.exports = router;
