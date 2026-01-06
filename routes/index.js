var express = require('express');
var router = express.Router();
const { db } = require('../db');  // Импортируем подключение к базе данных

/* Главная */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Гостевой дом у Рузанны'
  });
});

/* Номера */
router.get('/rooms', function (req, res, next) {
  const rooms = db.collection('rooms');
  rooms.find({}).toArray()
    .then((roomsList) => {
      res.render('hotel', {
        title: 'Номера',
        rooms: roomsList  // передаем данные номеров
      });
    })
    .catch((err) => res.status(500).send('Ошибка при загрузке данных: ' + err));
});

/* Контакты */
router.get('/contacts', function (req, res, next) {
  const contacts = db.collection('contacts');
  contacts.find({}).toArray()
    .then((contactsList) => {
      res.render('hotel', {
        title: 'Контакты',
        contacts: contactsList  // передаем данные контактов
      });
    })
    .catch((err) => res.status(500).send('Ошибка при загрузке данных: ' + err));
});

/* Страница для добавления данных в MongoDB */
router.get('/add', function (req, res, next) {
  const rooms = db.collection('rooms');
  rooms.insertMany([
    { title: 'Стандартный номер', desc: 'Комфортный номер для одного или двух человек' },
    { title: 'Люкс', desc: 'Роскошный номер с панорамным видом' },
    { title: 'Семейный номер', desc: 'Номер для семейного отдыха' }
  ])
  .then(() => res.send('Данные добавлены в базу'))
  .catch((err) => res.status(500).send('Ошибка при добавлении данных: ' + err));
});

module.exports = router;
