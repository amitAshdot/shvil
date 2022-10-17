const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const Files = require('../../models/Files');
var AWS = require('aws-sdk');
var http = require('http');
const pdf = require('pdf-parse');
var path = require('path');
var fs = require('fs');

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
    console.log('req.body: ', req.body)

    try {
        if (req.files === null || req.files.pdfFiles === null || req.files.pdfFiles.length === 0) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        let folderName = req.body.folderName
        if (folderName.length === 0) { // if folderName not exist create date
            folderName = new Date().getTime()
        }
        console.log('folderName: ', folderName)
        if (req.files.pdfFiles.length > 1) {
            var params = [];
            const folderPath = `${__dirname}/${folderName}/pdf`;
            const isExist = await exists(folderPath)

            req.files.pdfFiles.forEach(file => {
                const uploadPath = `${folderPath}/${file.name}`;
                console.log('uploadPath: ', uploadPath)
                console.log('folderPath: ', folderPath)
                if (isExist) {
                    file.mv(uploadPath, err => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                        console.log('file uploaded: ', uploadPath);
                    });
                } else {
                    fs.mkdir(folderPath, { recursive: true }, (err) => {
                        if (err) throw err;
                        file.mv(uploadPath, err => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send(err);
                            }
                            console.log('file uploaded: ', uploadPath);
                        });
                    });
                }
                console.log('params: ', params);
                params.push({ uploadPath });
            });
            return res.status(200).json({ msg: 'File uploaded successfully', data: params });
        } else {
            const uploadPath = `${__dirname}/${folderName}/pdf/${req.files.pdfFiles.name}`;
            req.files.pdfFiles.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err);
            });
            return res.status(200).json({ msg: 'File uploaded successfully', data: uploadPath });
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

        let initPassengersArr = await mainFunction('./pdfFiles');
        createExcelFile('./pdfFiles', initPassengersArr, res);

        res.download('file.xls'); // Set disposition and send it.

        return res.status(200).json({ msg: 'the names from pdf are', data: initPassengersArr, pathToReport: 'file.xls' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/files/report
// @desc    get names from files
// @access  Public
router.get('/report', auth, async (req, res) => {
    try {
        res.download(`file.xls`); // Set disposition and send it.
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




// --- helpers ---
const mainFunction = async (FILE_PATH) => {
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

const createExcelFile = async (FILE_PATH, test, res) => {
    var writeStream = fs.createWriteStream("file.xls");
    var header = "name" + "\t" + " isPaid" + "\t" + "isTicketSent" + "\t" + " isTicketSent" + "\t" + " ticketName" + "\t" + " relatedTo" + "\n";
    writeStream.write(header);
    for (let i = 0; i < test.length; i++) {
        if (test[i]) {
            var row = test[i].name + "\t" + test[i].isPaid + "\t" + test[i].isTicketSent + "\t" + test[i].ticketName.name + "\t" + test[i].relatedTo + "\n";
            writeStream.write(row);
        } else {
            // console.log('test[i] is null: ', test[i]);
            var row = 'there is no information' + "\n";
            writeStream.write(row);
        }
    }
}

const exists = async (path) => {
    try {
        await Fs.access(path)
        return true
    } catch {
        return false
    }
}


module.exports = router;
