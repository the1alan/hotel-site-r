const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, password_confirm } = req.body;

    if (!username || !email || !password || !password_confirm) {
        return res.render('register', { error: 'Все поля обязательны!' });
    }

    if (password !== password_confirm) {
        return res.render('register', { error: 'Пароли не совпадают!' });
    }

    if (password.length < 6) {
        return res.render('register', { error: 'Пароль должен быть минимум 6 символов!' });
    }

    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render('register', { error: 'Пользователь с таким именем уже существует!' });
        }

        const newUser = new User({
            username: username,
            password: password
        });

        await newUser.save();
        console.log(`✅ Пользователь зарегистрирован: ${username}`);
        res.redirect('/auth/login');
    } catch(err) {
        console.error('Ошибка регистрации:', err);
        res.render('register', { error: 'Ошибка при регистрации!' });
    }
});

// GET /auth/login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login', { error: 'Введите username и пароль!' });
    }

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.render('login', { error: 'Пользователь не найден!' });
        }

        if (user.checkPassword(password)) {
            req.session.userId = user._id;
            console.log(`✅ Пользователь вошел: ${username}`);
            res.redirect('/');
        } else {
            res.render('login', { error: 'Неверный пароль!' });
        }
    } catch(err) {
        console.error('Ошибка входа:', err);
        res.render('login', { error: 'Ошибка при входе!' });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Ошибка при logout:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        console.log('✅ Пользователь вышел');
        res.redirect('/');
    });
});

module.exports = router;
