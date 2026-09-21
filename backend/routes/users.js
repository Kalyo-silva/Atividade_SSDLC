const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Middleware to check admin
const isAdmin = (req, res, next) => {
    if (req.session.userType !== 1) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
};

router.get('/', isAdmin, async (req, res) => {
    const db = req.app.locals.db;
    const users = await db.all('SELECT id, username, type FROM users');
    res.json(users);
});

router.post('/', isAdmin, async (req, res) => {
    const { username, password, type } = req.body;
    const db = req.app.locals.db;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password, type, must_change_password) VALUES (?, ?, ?, 0)', [username, hashedPassword, type]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error or duplicate user' });
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    const { username, password, type } = req.body;
    const db = req.app.locals.db;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.run('UPDATE users SET username = ?, password = ?, type = ? WHERE id = ?', [username, hashedPassword, type, req.params.id]);
        } else {
            await db.run('UPDATE users SET username = ?, type = ? WHERE id = ?', [username, type, req.params.id]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
