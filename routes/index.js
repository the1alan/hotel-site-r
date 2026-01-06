var express = require('express');
var router = express.Router();

/* Главная страница гостиницы */
router.get('/', function(req, res, next) {
  res.send('<h1>Гостиница Undefined</h1>');
});

/* Номера через Mongoose */
router.get('/rooms', async function (req, res, next) {
  try {
    var Room = require('../models/room.js').Room;
    const roomsList = await Room.find({}).sort({ created: -1 });
    
    res.render('hotel', {
      title: 'Номера (Mongoose)',
      rooms: roomsList
    });
  } catch (err) {
    res.status(500).send('Ошибка Mongoose: ' + err);
  }
});

/* Страница контактов */
router.get('/contacts', function(req, res, next) {
  res.send('<h1>Контакты гостиницы Undefined</h1>');
});

module.exports = router;
