var express = require('express');
var router = express.Router();

// 🛡️ Middleware - проверка авторизации
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
    <h1>Гостиница</h1>
    ${loginLink} |
    <a href="/rooms">Номера</a> | 
    <a href="/contacts">Контакты</a> |
    <a href="/counter">Счётчик</a> |
    <a href="/admin">🔧 Админ</a>
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


/* 🔧 Админ панель - ТОЛЬКО ДЛЯ ADMIN */
router.get('/admin', requireAuth, async function(req, res) {
  try {
    var Room = require('../models/room.js').Room;
    const roomsList = await Room.find({}).sort({ created: -1 });
    let roomsHtml = roomsList.map(room => `
      <li>
        <strong>${room.title}</strong> (${room.nick})
        <button onclick="editRoom('${room._id}')">✏️ Редактировать</button>
        <button onclick="deleteRoom('${room._id}')">🗑️ Удалить</button>
      </li>
    `).join('');
    
    res.send(`
      <h1>🔧 Админ панель (${req.session.user.username})</h1>
      <h2>Управление номерами:</h2>
      <ul>${roomsHtml}</ul>
      
      <h2>➕ Новый номер</h2>
      <form method="post" action="/rooms">
        Название: <input name="title" required><br>
        Ник: <input name="nick" required><br>
        Аватар: <input name="avatar"><br>
        Описание: <textarea name="desc"></textarea><br>
        <button>Добавить</button>
      </form>
      
      <script>
        let editingId = null;
        function editRoom(id) {
          editingId = id;
          // Простая форма редактирования (можно модалку)
          const title = prompt('Название:');
          const nick = prompt('Ник:');
          const avatar = prompt('Аватар URL:');
          const desc = prompt('Описание:');
          
          if (title && nick) {
            fetch('/rooms/' + id, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({title, nick, avatar, desc})
            }).then(() => location.reload());
          }
        }
        
        function deleteRoom(id) {
          if (confirm('Удалить?')) {
            fetch('/rooms/' + id, {method: 'DELETE'})
              .then(() => location.reload());
          }
        }
      </script>
      
      <a href="/profile">👤 Профиль</a> | 
      <a href="/logout">🚪 Выход</a>
    `);
  } catch(err) {
    res.status(500).send('Ошибка: ' + err);
  }
});


/* ✏️ PUT редактировать номер */
router.put('/rooms/:id', requireAuth, async function(req, res) {
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

module.exports = router;
