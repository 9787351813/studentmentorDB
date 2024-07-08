const express = require('express');
const mentorRoutes = require('./routes/mentorroutes');
const studentRoutes = require('./routes/studentroutes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.json());
app.use('/api/mentors', mentorRoutes);
app.use('/api/students', studentRoutes);



module.exports = app;
