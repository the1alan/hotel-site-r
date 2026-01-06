var express = require('express');
var router = express.Router();

/* Главная */
router.get('/', function(req, res) {
  res.send('<h1>Гостиница Undefined</h1><a href="/rooms">Номера</a>');
});

/* GET номера Mongoose */
router.get('/rooms', async function(req, res) {
  try {
    var Room = require('../models/room.js').Room;
    const roomsList = await Room.find({}).sort({ created: -1 });
    res.render('hotel', { title: 'Номера (Mongoose)', rooms: roomsList });
  } catch(err) {
    res.status(500).send('Ошибка Mongoose: ' + err);
  }
});

/* POST создать */
router.post('/rooms', async function(req, res) {
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
  } catch(err) {
    res.status(500).send('Ошибка: ' + err);
  }
});

/* DELETE номер */
router.delete('/rooms/:id', async function(req, res) {
  try {
    var Room = require('../models/room.js').Room;
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT обновить номер */
router.put('/rooms/:id', async function(req, res) {
  try {
    var Room = require('../models/room.js').Room;
    await Room.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      nick: req.body.nick,
      avatar: req.body.avatar,
      desc: req.body.desc
    });
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* Счётчик посещений SESSION */
router.get('/counter', function(req, res) {
  if (!req.session.counter) {
    req.session.counter = 0;
  }
  req.session.counter++;
  res.send(`<h1>Вы посетили эту страницу ${req.session.counter} раз</h1><a href="/counter"> Назад</a>`);
});

/* Контакты */
router.get('/contacts', function(req, res) {
  res.send('<h1>Контакты</h1><p>+370 123 456 789</p><a href="/rooms">Номера</a>');
});

module.exports = router;
