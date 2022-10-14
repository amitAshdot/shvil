const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const Files = require('../../models/Files');
var AWS = require('aws-sdk');


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



module.exports = router;