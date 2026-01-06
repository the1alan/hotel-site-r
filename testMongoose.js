const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/undefined2026');

var Room = require('./models/room.js').Room;

var room = new Room({
  title: 'Undefined Тестовый номер',
  nick: 'undefined-test',
  avatar: 'images/undefined-test.jpeg',
  desc: 'Тестовый номер для проверки Mongoose'
});

room.save()
  .then(() => {
    console.log('Номер сохранён!');
    return Room.find({ nick: 'undefined-test' });
  })
  .then(rooms => {
    console.log('Найденные номера:', rooms);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Ошибка:', err);
    mongoose.connection.close();
  });
