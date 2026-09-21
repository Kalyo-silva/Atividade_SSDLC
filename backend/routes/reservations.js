const express = require('express');
const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    next();
};

const isProfessor = (req, res, next) => {
    if (req.session.userType !== 2) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
};

router.get('/', isAuthenticated, async (req, res) => {
    const db = req.app.locals.db;
    if (req.session.userType === 1) { // Admin can see all active
        const resList = await db.all('SELECT r.*, c.name as classroom_name, u.username as professor_name FROM reservations r JOIN classrooms c ON r.classroom_id = c.id JOIN users u ON r.user_id = u.id');
        return res.json(resList);
    } else { // Professor sees their own
        const resList = await db.all('SELECT r.*, c.name as classroom_name FROM reservations r JOIN classrooms c ON r.classroom_id = c.id WHERE r.user_id = ?', [req.session.userId]);
        return res.json(resList);
    }
});

router.post('/', isProfessor, async (req, res) => {
    const { classroom_id, date } = req.body;
    const db = req.app.locals.db;
    
    const existing = await db.get('SELECT r.*, u.username FROM reservations r JOIN users u ON r.user_id = u.id WHERE r.classroom_id = ? AND r.date = ? AND r.status = ?', [classroom_id, date, 'active']);
    if (existing) {
        return res.status(409).json({ success: false, message: `Conflito! A sala já foi reservada neste dia pelo professor: ${existing.username}` });
    }
    
    await db.run('INSERT INTO reservations (classroom_id, user_id, date, status) VALUES (?, ?, ?, ?)', [classroom_id, req.session.userId, date, 'active']);
    res.json({ success: true });
});

router.put('/:id/cancel', isProfessor, async (req, res) => {
    const db = req.app.locals.db;
    const reservation = await db.get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!reservation || reservation.user_id !== req.session.userId) return res.status(403).json({ success: false, message: 'Forbidden' });
    
    await db.run('UPDATE reservations SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ success: true });
});

router.put('/:id', isProfessor, async (req, res) => {
    const db = req.app.locals.db;
    const { date, classroom_id } = req.body;
    
    const reservation = await db.get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!reservation || reservation.user_id !== req.session.userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    const existing = await db.get('SELECT r.*, u.username FROM reservations r JOIN users u ON r.user_id = u.id WHERE r.classroom_id = ? AND r.date = ? AND r.status = ? AND r.id != ?', [classroom_id || reservation.classroom_id, date, 'active', req.params.id]);
    if (existing) {
        return res.status(409).json({ success: false, message: `Conflito! A sala já foi reservada neste dia pelo professor: ${existing.username}` });
    }

    await db.run('UPDATE reservations SET date = ? WHERE id = ?', [date, req.params.id]);
    res.json({ success: true });
});

router.get('/classroom/:id', isAuthenticated, async (req, res) => {
    const db = req.app.locals.db;
    const reservations = await db.all('SELECT date FROM reservations WHERE classroom_id = ? AND status = ?', [req.params.id, 'active']);
    res.json(reservations);
});

module.exports = router;
