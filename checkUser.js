const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/hotel-site');

async function testUser() {
    try {
        // Создание пользователя
        const user = new User({
            username: 'testuser',
            password: 'password123'
        });
        
        await user.save();
        console.log('✅ Пользователь сохранён:', user);
        
        // Проверка пароля
        const isCorrect = user.checkPassword('password123');
        console.log('✅ Пароль верный:', isCorrect);
        
        const isWrong = user.checkPassword('wrongpassword');
        console.log('❌ Неверный пароль:', !isWrong);
        
        mongoose.connection.close();
    } catch(err) {
        console.error('Ошибка:', err);
        mongoose.connection.close();
    }
}

testUser();
