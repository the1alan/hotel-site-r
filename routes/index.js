const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

// GET home page (публичная)
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Hotel Site' });
});

// GET protected page (требует авторизации)
router.get('/dashboard', checkAuth, (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
