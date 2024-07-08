// controllers/studentController.js

const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
};

const assignMentor = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        const mentor = await Mentor.findById(req.params.mentorId);

        if (!student || !mentor) {
            return res.status(404).send();
        }

        student.mentor = mentor._id;
        await student.save();

        mentor.students.push(student._id);
        await mentor.save();

        res.send(student);
    } catch (error) {
        res.status(400).send(error);
    }
};

const changeMentor = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        const newMentor = await Mentor.findById(req.params.newMentorId);

        if (!student || !newMentor) {
            return res.status(404).send();
        }

        // Remove student from old mentor
        if (student.mentor) {
            const oldMentor = await Mentor.findById(student.mentor);
            oldMentor.students.pull(student._id);
            await oldMentor.save();
        }

        // Assign new mentor
        student.mentor = newMentor._id;
        await student.save();

        newMentor.students.push(student._id);
        await newMentor.save();

        res.send(student);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getPreviousMentor = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('mentor');
        if (!student) {
            return res.status(404).send();
        }
        res.send(student.mentor);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = {
    createStudent,
    assignMentor,
    changeMentor,
    getPreviousMentor
};
