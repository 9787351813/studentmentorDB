// controllers/mentorController.js

const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

const createMentor = async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().populate('students');
        res.send(mentors);
    } catch (error) {
        res.status(400).send(error);
    }
};

const assignStudentToMentor = async (req, res) => {
    try {
        const mentorId = req.params.mentorId.trim();
        const studentId = req.params.studentId.trim();

        const mentor = await Mentor.findById(mentorId);
        const student = await Student.findById(studentId);

        if (!mentor || !student) {
            return res.status(404).send({ message: 'Mentor or Student not found' });
        }

        mentor.students.push(student._id);
        await mentor.save();

        student.mentor = mentor._id;
        await student.save();

        res.send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
};
const assignMultipleStudentsToMentor = async (req, res) => {
    try {
        const { mentorId, studentIds } = req.body;
        const mentor = await Mentor.findById(mentorId);
        
        if (!mentor) {
            return res.status(404).send({ message: 'Mentor not found' });
        }

        const students = await Student.find({
            _id: { $in: studentIds },
            mentor: { $exists: false }  // Find students without a mentor
        });

        if (students.length !== studentIds.length) {
            return res.status(400).send({ message: 'Some students already have a mentor' });
        }

        students.forEach(student => {
            mentor.students.push(student._id);
            student.mentor = mentor._id;
        });

        await Promise.all(students.map(student => student.save()));
        await mentor.save();

        res.send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getStudentsWithoutMentor = async (req, res) => {
    try {
        const students = await Student.find({ mentor: { $exists: false } });
        res.send(students);
    } catch (error) {
        res.status(400).send(error);
    }
};

const assignOrChangeMentorForStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        const newMentor = await Mentor.findById(req.body.mentorId);

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        if (!newMentor) {
            return res.status(404).send({ message: 'Mentor not found' });
        }

        // If the student already has a mentor, remove the student from the old mentor's list
        if (student.mentor) {
            const oldMentor = await Mentor.findById(student.mentor);
            if (oldMentor) {
                oldMentor.students.pull(student._id);
                await oldMentor.save();
            }

            // Add the old mentor to the previousMentors list if it's not already there
            if (!student.previousMentors.includes(student.mentor)) {
                student.previousMentors.push(student.mentor);
            }
        }

        // Assign the new mentor to the student
        newMentor.students.push(student._id);
        await newMentor.save();

        // Update the student's mentor
        student.mentor = newMentor._id;
        await student.save();

        res.status(200).send({
            message: 'Mentor assigned successfully',
            student: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred', error: error.message });
    }
};

const getPreviousMentorsForStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('previousMentors');
         console.log(student);
        if (!student) {
            return res.status(404).send({ message: 'previous mentors not found' });
        }

        res.send(student.previousMentors);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred', error: error.message });
    }
};

const getStudentsForMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId).populate('students');

        if (!mentor) {
            return res.status(404).send({ message: 'Mentor not found' });
        }

        res.send(mentor.students);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred', error: error.message });
    }
};


module.exports = {
    createMentor,
    assignMultipleStudentsToMentor,
    getAllMentors,
    assignStudentToMentor,
    getStudentsWithoutMentor,
    assignOrChangeMentorForStudent,
    getStudentsForMentor,
    getPreviousMentorsForStudent
};




