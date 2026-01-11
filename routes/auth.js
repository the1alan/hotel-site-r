const express = require('express');
const router = express.Router();

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST /auth/register
router.post('/register', (req, res) => {
    const { username, email, password, password_confirm } = req.body;

    // Валидация
    if (!username || !email || !password || !password_confirm) {
        return res.render('register', { error: 'Все поля обязательны!' });
    }

    if (password !== password_confirm) {
        return res.render('register', { error: 'Пароли не совпадают!' });
    }

    if (password.length < 6) {
        return res.render('register', { error: 'Пароль должен быть минимум 6 символов!' });
    }

    // TODO: Проверка существующего пользователя
    // TODO: Сохранение в БД
    // TODO: Хэширование пароля

    console.log(`Регистрация: ${username}, ${email}`);
    res.redirect('/auth/login');
});

module.exports = router;
