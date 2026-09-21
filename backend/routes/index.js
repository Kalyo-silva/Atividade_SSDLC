const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const classroomRoutes = require('./classrooms');
const reservationRoutes = require('./reservations');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;
