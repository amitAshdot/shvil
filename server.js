const express = require('express');
const config = require('config');
const connectDB = require('./config/db');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
var bodyParser = require("body-parser");
// const { mainFunction } = require('./utils');
const fileUpload = require('express-fileupload');


const app = express();
let user;
// Connect Database
connectDB(app).then((db) => {
    user = db;
});


app.use(fileUpload());

// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies


//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/tickets', require('./routes/api/tickets'));
app.use('/api/flight', require('./routes/api/flight'));
app.use('/api/files', require('./routes/api/files'));
app.use('/api/mail', require('./routes/api/mail'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    // app.get('/*', function (req, res) {
    //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
    // });
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => { res.send('  API Running  ') });

app.listen(PORT, () => { console.log(`server started on port ${PORT}`) });

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// mainFunction('./pdfFiles')
// mainFunction();