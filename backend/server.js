const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDB } = require('./database');
const routes = require('./routes/index');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'secret-key-ssdlc',
    resave: false,
    saveUninitialized: true
}));

app.use('/api', routes);

// removed fallback

async function start() {
    const db = await initDB();
    app.locals.db = db;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

start();

module.exports = app;
