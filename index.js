const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');


const port = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('Server is running');
});

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err.message);
    });
