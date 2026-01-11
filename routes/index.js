var express = require('express');
var router = express.Router();
const { Room } = require('../models/db.js');

// 🛡️ Middleware авторизации
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login?from=' + req.originalUrl);
  }
  next();
}

/* Главная */
router.get('/', function(req, res) {
  const loginLink = req.session.user ? 
    `<a href="/profile">👋 ${req.session.user.username}</a>` : 
    `<a href="/login">🔐 Логин</a>`;
    
  res.send(`
    <h1>🏨 Гостиница Undefined</h1>
    ${loginLink} |
    <a href="/rooms">📝 Номера</a> | 
    <a href="/contacts">📞 Контакты</a> |
    <a href="/counter">🔢 Счётчик</a> |
    <a href="/admin">🔧 Админ</a>
    <hr>
    <small>Render.com 🚀 + MongoDB Atlas ☁️</small>
  `);
});

/* GET номера */
router.get('/rooms', async function(req, res) {
  try {
    const roomsList = await Room.find({}).sort({ created: -1 });
    res.render('hotel', { title: 'Номера (Atlas)', rooms: roomsList });
  } catch(err) {
    res.status(500).send('Ошибка MongoDB Atlas: ' + err.message);
  }
});

/* POST создать */
router.post('/rooms', async function(req, res) {
  try {
    const newRoom = new Room({
      title: req.body.title,
      nick: req.body.nick,
      avatar: req.body.avatar || '',
      desc: req.body.desc
    });
    await newRoom.save();
    res.redirect('/rooms');
  } catch(err) {
    res.status(500).send('Ошибка: ' + err.message);
  }
});

/* PUT редактировать */
router.put('/rooms/:id', requireAuth, async function(req, res) {
  try {
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

/* DELETE номер */
router.delete('/rooms/:id', async function(req, res) {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* Контакты */
router.get('/contacts', function(req, res) {
  res.send(`
    <h1>📞 Контакты</h1>
    <p>Тел: +370 123 456 789</p>
    <p>Email: info@hotel.lt</p>
    <a href="/">← Главная</a>
  `);
});

/* Счётчик */
router.get('/counter', function(req, res) {
  if (!req.session.counter) req.session.counter = 0;
  req.session.counter++;
  res.send(`
    <h1>🔢 Счётчик: ${req.session.counter}</h1>
    <a href="/counter">Обновить</a> | <a href="/">Главная</a>
  `);
});

/* 🔐 LOGIN */
router.get('/login', function(req, res) {
  res.send(`
    <h1>🔐 Авторизация</h1>
    <form method="post" action="/login">
      Логин: <input name="username" required><br><br>
      Пароль: <input type="password" name="password" required><br><br>
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
    res.send('<h1>❌ Неверно!</h1><a href="/login">← Назад</a>');
  }
});

router.get('/profile', function(req, res) {
  if (!req.session.user) return res.redirect('/login');
  res.send(`
    <h1>👋 ${req.session.user.username}</h1>
    <p>ID: ${req.session.user.id}</p>
    <a href="/admin">🔧 Админ</a> | 
    <a href="/logout">🚪 Выход</a>
  `);
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

/* 🔧 Админ панель */
router.get('/admin', requireAuth, async function(req, res) {
  try {
    const roomsList = await Room.find({}).sort({ created: -1 });
    let roomsHtml = roomsList.map(room => `
      <li>
        <strong>${room.title}</strong> (${room.nick})
        <button onclick="editRoom('${room._id}')">✏️</button>
        <button onclick="deleteRoom('${room._id}')">🗑️</button>
      </li>
    `).join('');
    
    res.send(`
      <h1>🔧 Админ (${req.session.user.username})</h1>
      <h3>Номера:</h3><ul>${roomsHtml}</ul>
      <h3>➕ Добавить:</h3>
      <form method="post" action="/rooms">
        <input name="title" placeholder="Название" required><br>
        <input name="nick" placeholder="Ник" required><br>
        <input name="avatar" placeholder="Аватар"><br>
        <textarea name="desc" placeholder="Описание"></textarea><br>
        <button>Добавить</button>
      </form>
      <script>
        function editRoom(id) {
          const title = prompt('Название:');
          const nick = prompt('Ник:');
          fetch('/rooms/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, nick})
          }).then(() => location.reload());
        }
        function deleteRoom(id) {
          if(confirm('Удалить?')) {
            fetch('/rooms/' + id, {method: 'DELETE'}).then(() => location.reload());
          }
        }
      </script>
      <a href="/profile">Профиль</a> | <a href="/logout">Выход</a>
    `);
  } catch(err) {
    res.status(500).send('Ошибка: ' + err);
  }
});

module.exports = router;
