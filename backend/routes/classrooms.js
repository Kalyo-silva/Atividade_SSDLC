const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const isAdmin = (req, res, next) => {
    if (req.session.userType !== 1) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
};

const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    next();
};

router.get('/', isAuthenticated, async (req, res) => {
    const db = req.app.locals.db;
    const classrooms = await db.all('SELECT * FROM classrooms');
    res.json(classrooms);
});

router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    const { name, location, type } = req.body;
    const image_path = req.file ? '/uploads/' + req.file.filename : null;
    const db = req.app.locals.db;
    await db.run('INSERT INTO classrooms (name, location, type, image_path) VALUES (?, ?, ?, ?)', [name, location, type, image_path]);
    res.json({ success: true });
});

router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
    const { name, location, type } = req.body;
    const db = req.app.locals.db;
    if (req.file) {
        const image_path = '/uploads/' + req.file.filename;
        await db.run('UPDATE classrooms SET name = ?, location = ?, type = ?, image_path = ? WHERE id = ?', [name, location, type, image_path, req.params.id]);
    } else {
        await db.run('UPDATE classrooms SET name = ?, location = ?, type = ? WHERE id = ?', [name, location, type, req.params.id]);
    }
    res.json({ success: true });
});

router.delete('/:id', isAdmin, async (req, res) => {
    const db = req.app.locals.db;
    const count = await db.get('SELECT COUNT(*) as c FROM reservations WHERE classroom_id = ? AND status = ?', [req.params.id, 'active']);
    if (count.c > 0) return res.status(400).json({ success: false, message: 'Cannot delete classroom with active reservations' });
    await db.run('DELETE FROM classrooms WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

module.exports = router;
