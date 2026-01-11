var express = require('express');
var router = express.Router();

/* Главная */
router.get('/', function(req, res) {
  res.send(`
    <h1>Гостиница</h1>
    <a href="/rooms">Номера</a> | 
    <a href="/contacts">Контакты</a> |
    <a href="/counter">Счётчик</a> |
    <a href="/login">🔐 Логин</a>
  `);
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

/* Контакты */
router.get('/contacts', function(req, res) {
  res.send(`
    <h1>Контакты</h1>
    <p>📞 +370 123 456 789</p>
    <a href="/">← Главная</a>
  `);
});

/* Счётчик SESSION */
router.get('/counter', function(req, res) {
  if (!req.session.counter) req.session.counter = 0;
  req.session.counter++;
  res.send(`
    <h1>Вы посетили ${req.session.counter} раз</h1>
    <a href="/counter">Обновить</a> | <a href="/">Главная</a>
  `);
});

/* 🔐 LOGIN СИСТЕМА */
router.get('/login', function(req, res) {
  res.send(`
    <h1>🔐 Авторизация</h1>
    <form method="post" action="/login">
      <input name="username" placeholder="Логин" required><br><br>
      <input type="password" name="password" placeholder="Пароль" required><br><br>
      <button>Войти</button>
    </form>
    <p><b>admin / 123</b></p>
    <a href="/">Главная</a>
  `);
});

router.post('/login', function(req, res) {
  if (req.body.username === 'admin' && req.body.password === '123') {
    req.session.user = { id: 1, username: 'admin' };
    res.redirect('/profile');
  } else {
    res.send('<h1>❌ Неверный логин/пароль!</h1><a href="/login">← Назад</a>');
  }
});

router.get('/profile', function(req, res) {
  if (!req.session.user) return res.redirect('/login');
  res.send(`
    <h1>👋 ${req.session.user.username}</h1>
    <p>ID: ${req.session.user.id}</p>
    <a href="/logout">🚪 Выход</a> | 
    <a href="/">Главная</a>
  `);
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
