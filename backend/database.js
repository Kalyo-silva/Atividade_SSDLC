const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

async function initDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            type INTEGER, -- 1: Admin, 2: Professor
            must_change_password INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS classrooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            location TEXT,
            type TEXT, -- Laboratório or sala de aula
            image_path TEXT
        );

        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            user_id INTEGER,
            date TEXT,
            status TEXT DEFAULT 'active', -- active, completed, cancelled
            FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

    // Check if admin exists
    const admin = await db.get('SELECT * FROM users WHERE username = ?', 'admin');
    if (!admin) {
        const hashedPassword = await bcrypt.hash('123', 10);
        await db.run('INSERT INTO users (username, password, type, must_change_password) VALUES (?, ?, 1, 1)', ['admin', hashedPassword]);
    }

    return db;
}

module.exports = { initDB };
