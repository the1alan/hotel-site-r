var express = require('express');
var router = express.Router();

/* Главная страница гостиницы */
router.get('/', function(req, res, next) {
  res.send('<h1>Гостиница Undefined</h1>');
});

/* Номера через Mongoose (GET) */
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

/* Создать новый номер (CRUD CREATE) - ДОБАВЬ ПОД GET */
router.post('/rooms', async function (req, res) {
  try {
    var Room = require('../models/room.js').Room;
    const newRoom = new Room({
      title: req.body.title,
      nick: req.body.nick,
      avatar: req.body.avatar || '',
      desc: req.body.desc
    });
    
    await newRoom.save();
    res.redirect('/rooms');
  } catch (err) {
    res.status(500).send('Ошибка создания: ' + err);
  }
});



/* Страница контактов */
router.get('/contacts', function(req, res, next) {
  res.send('<h1>Контакты гостиницы Undefined</h1>');
});

module.exports = router;
