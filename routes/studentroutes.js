// routes/student.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Create Student
router.post('/create', studentController.createStudent);

// Assign a Student to Mentor
router.post('/:studentId/assign-mentor/:mentorId', studentController.assignMentor);

// Change Mentor for a Student
router.post('/:studentId/change-mentor/:newMentorId', studentController.changeMentor);

// Show previously assigned mentor for a student
router.get('/:studentId/previous-mentor', studentController.getPreviousMentor);

module.exports = router;
