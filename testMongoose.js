const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/hotelDB');

var Room = require('./models/room.js').Room;

var room = new Room({
  title: 'Undefined Тестовый номер',
  nick: 'undefined-test-' + Date.now(),
  avatar: 'https://via.placeholder.com/200x150?text=Test',
  desc: 'Тестовый номер для проверки Mongoose'
});

room.save()
  .then(() => {
    console.log('✅ Номер сохранён!');
    return Room.find({ });
  })
  .then(rooms => {
    console.log('✅ Найденные номера:', rooms.length);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Ошибка:', err.message);
    mongoose.connection.close();
  });
