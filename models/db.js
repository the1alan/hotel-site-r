const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel';

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ MongoDB:', err));

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  nick: { type: String, required: true },
  avatar: String,
  desc: String,
  created: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = {
  Room: Room,
  mongoose: mongoose
};
