// routes/mentor.js

const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
    ``
// Create Mentor
router.post('/create', mentorController.createMentor);




// Get All Mentors
router.get('/', mentorController.getAllMentors);

// Assign Student to Mentor
router.post('/:mentorId/assign-student/:studentId', mentorController.assignStudentToMentor);
router.post('/assign-multiple-students', mentorController.assignMultipleStudentsToMentor);
router.get('/students-without-mentor', mentorController.getStudentsWithoutMentor);
router.post('/assign-mentor/:studentId', mentorController.assignOrChangeMentorForStudent);
router.get('/:mentorId/students', mentorController.getStudentsForMentor);
router.get('/student/:studentId/previous-mentors', mentorController.getPreviousMentorsForStudent);


module.exports = router;
