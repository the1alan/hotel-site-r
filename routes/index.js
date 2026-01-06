var express = require('express');
var router = express.Router();

/* Главная */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Гостевой дом у Рузанны'
  });
});

/* Номера */
router.get('/rooms', function(req, res) {
  res.render('hotel', {
    title: 'Номера',
    desc: 'Комфортные номера для проживания гостей'
  });
});

/* Контакты */
router.get('/contacts', function(req, res) {
  res.render('hotel', {
    title: 'Контакты',
    desc: 'Свяжитесь с нами удобным способом'
  });
});

module.exports = router;
