const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const Files = require('../../models/Files');
var AWS = require('aws-sdk');
// import { mainFunction } from '../utils';

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const files = await Files.find().sort({ date: -1 });
        console.log(files);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/files
// @desc    Create or Update files flight
// @access  Private
router.post('/', async (req, res) => {
    try {
        if (req.files === null || req.files.pdfFiles === null || req.files.pdfFiles.length === 0) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // const s3 = new AWS.S3({
        //     accessKeyId: config.get('accessKeyId'),
        //     secretAccessKey: config.get('secretAccessKey'),
        // });
        if (req.files.pdfFiles.length > 1) {
            var params = [];
            req.files.pdfFiles.forEach(file => {
                // Binary data base64
                const fileContent = Buffer.from(file.data, 'binary');
                // Setting up S3 upload parameters
                params.push({
                    Bucket: config.get('Bucket'),
                    Key: file.name, // File name you want to save as in S3
                    Body: fileContent
                });
            });
            const responses = await Promise.all(
                // params.map(param => s3.upload(param).promise())
            )
            return res.status(200).json({ msg: 'File uploaded successfully', data: responses });
        } else {
            // Binary data base64
            const fileContent = Buffer.from(req.files.pdfFiles.data, 'binary');

            // Setting up S3 upload parameters
            const params = {
                Bucket: config.get('Bucket'),
                Key: req.files.pdfFiles.name, // File name you want to save as in S3
                Body: fileContent
            };
            // s3.upload(params, function (err, data) {
            //     if (err) {
            //         console.log(err)
            //         console.log('params: ', params);
            //         throw err;
            //     }

            //     return res.status(200).json({ msg: 'File uploaded successfully.', data: data });
            // })
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/files/pdf-names
// @desc    get names from files
// @access  Public
router.get('/pdf-names', auth, async (req, res) => {
    try {
        console.log('req.query: ', req.query);
        // const path = `${req.body.pdfFiles}`;
        let test = await mainFunction('./pdfFiles');
        // console.log('testtesttestt: ', test);
        console.log('test123: ', test);
        return res.status(200).json({ msg: 'the names from pdf are', data: test });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




// --- helpers ---
const mainFunction = async (FILE_PATH) => {
    var path = require('path');
    var fs = require('fs');
    const pdf = require('pdf-parse');
    if (!FILE_PATH) {
        console.log("No FILE_PATH, FILE_PATH: ", FILE_PATH);
    }
    //joining path of directory 
    var directoryPath = path.join('pdf', '');
    //only pdf
    const EXTENSION = '.pdf';
    let peopleObjectArr = []
    try {
        //passsing directoryPath and callback function
        const files = fs.readdirSync(FILE_PATH, { withFileTypes: true });
        const targetFiles = files.filter(file => {
            return path.extname(file.name).toLowerCase() === EXTENSION;
        });

        // Basic Usage
        let allFilePromises = targetFiles.map(file => {
            if (fs.existsSync(`${FILE_PATH}/${file.name}`)) {
                let dataBuffer = fs.readFileSync(`${FILE_PATH}/${file.name}`);
                let filePromise = pdf(dataBuffer)
                    .then(function (data) {
                        var reName = /Passenger:(.*)\n/gm;
                        var name = "";
                        let match = reName.exec(data.text);
                        if (match != null) {
                            name = match[1];
                            name = name.replace(/([A-Z])/g, ' $1').trim();
                            peopleObjectArr.push({ name: name, isPaid: false, isTicketSent: false, ticketName: file });
                            return { name: name, isPaid: false, isTicketSent: false, ticketName: file, relatedTo: null };
                        }
                    })
                    .catch(function (error) {
                        console.log('error pad-parse: ', error)
                    });
                return filePromise;
            }

        });
        let allPeopleObjectArr = await Promise.all(allFilePromises);
        return allPeopleObjectArr;
    } catch (err) {
        console.log(err)
    }

}
module.exports = router;