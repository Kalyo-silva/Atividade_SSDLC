const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.locals.db;
    
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            req.session.userType = user.type;
            res.json({ success: true, user: { id: user.id, username: user.username, type: user.type, must_change_password: user.must_change_password } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.post('/change-password', async (req, res) => {
    const { newPassword } = req.body;
    if (!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const db = req.app.locals.db;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.run('UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?', [hashedPassword, req.session.userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
