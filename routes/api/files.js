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
    try {
        if (req.files === null || req.files.pdfFiles === null || req.files.pdfFiles.length === 0) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        let folderName = req.body.folderName
        if (folderName.length === 0) { // if folderName not exist create date
            folderName = new Date().getTime()
        }
        if (req.files.pdfFiles.length > 1) {
            var params = [];
            const folderPath = `${__dirname}/${folderName}/pdf`;
            const isExist = await exists(folderPath)

            req.files.pdfFiles.forEach(file => {
                const uploadPath = `${folderPath}/${file.name}`;
                if (isExist) {
                    file.mv(uploadPath, err => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    });
                } else {
                    fs.mkdir(folderPath, { recursive: true }, (err) => {
                        if (err) throw err;
                        file.mv(uploadPath, err => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send(err);
                            }
                        });
                    });
                }
                params.push({ uploadPath });
            });
            return res.status(200).json({ msg: 'File uploaded successfully', data: params });
        } else {
            var params = [];
            const folderPath = `${__dirname}/${folderName}/pdf`;
            const isExist = await exists(folderPath)
            const uploadPath = `${folderPath}/${req.files.pdfFiles.name}`;
            if (isExist) {
                req.files.pdfFiles.mv(uploadPath, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                });
            } else {
                fs.mkdir(folderPath, { recursive: true }, (err) => {
                    if (err) throw err;
                    req.files.pdfFiles.mv(uploadPath, err => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    });
                });
            }
            params.push({ uploadPath });
            return res.status(200).json({ msg: 'File uploaded successfully', data: params });
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
router.post('/pdf-names', auth, async (req, res) => {
    try {
        const { folderName } = req.body;
        let initPassengersArr = await mainFunction(`${__dirname}/${folderName}/pdf`);
        const FILE_PATH = `${__dirname}/${folderName}`;
        createExcelFile(FILE_PATH, initPassengersArr, res);
        // res.download('file.xls'); // Set disposition and send it.
        return res.status(200).json({ msg: 'the names from pdf are', data: initPassengersArr, pathToReport: FILE_PATH + '/file.xls' });
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
                            peopleObjectArr.push({ no: peopleObjectArr.length, name: name, isPaid: false, status: 0, ticketName: file, relatedTo: '' });
                            return { no: peopleObjectArr.length, name: name, isPaid: false, status: 0, ticketName: file, relatedTo: '' };
                        } else {
                            //Royal Caribbean
                            var reName = /PREPAID GRATUITIES.*?CRUISE SUMMARY/gms;
                            var name = "";
                            let match = reName.exec(data.text);

                            if (match != null) {
                                let names = match[0].split('\n')
                                names.shift();//deleting unnecessary first row 
                                names.pop(); //delete unnecessary empty row
                                names.pop();//deleting unnecessary last roq
                                names = names.map(name => {
                                    // name = name.replace(/([A-Z])/g, ' $1').trim();
                                    return name.replace(/((_\s+)+_)|(No)/mg, '')
                                });
                                peopleObjectArr.push({ no: peopleObjectArr.length, name: names[0], isPaid: false, status: 0, ticketName: file, relatedTo: names });
                                return { no: peopleObjectArr.length, name: names[0], isPaid: false, status: 0, ticketName: file, relatedTo: names };

                            } else {
                                //MSC
                                var reName = /CRUISE  TICKET.*?Ship/gms;
                                var name = "";
                                let match = reName.exec(data.text);
                                if (match != null) {
                                    let names = match[0].split('\n')
                                    names.shift();//deleting unnecessary first row 
                                    names.shift();//deleting unnecessary first row 
                                    names.pop();//deleting unnecessary last roq
                                    peopleObjectArr.push({ no: peopleObjectArr.length, name: names[0], isPaid: false, status: 0, ticketName: file, relatedTo: names });
                                    return { no: peopleObjectArr.length, name: names[0], isPaid: false, status: false, ticketName: file, relatedTo: names };
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log('error pad-parse: ', error)
                    });
                return filePromise;
            } else {
                return null;
            }

        });
        let allPeopleObjectArr = await Promise.all(allFilePromises);
        return allPeopleObjectArr;
    } catch (err) {
        console.log(err)
    }

}

const createExcelFile = async (FILE_PATH, initPassengersArr, res) => {
    var writeStream = fs.createWriteStream(`${FILE_PATH}/report.xls`);
    var header = "שם" + "\t" + "בוצע תשלום מלא" + "\t" + "סטאטוס שליחת כרטיס" + "\t" + " שם הקובץ" + "\t" + "נוסע/ת עם" + "\n";
    writeStream.write(header);
    if (initPassengersArr) {
        for (let i = 0; i < initPassengersArr.length; i++) {
            if (initPassengersArr[i]) {
                const { name, isPaid, status, ticketName, relatedTo } = initPassengersArr[i];
                const statusWords = ['חדש', 'לא נשלח', 'כרטיס נשלח', 'נשלח מייל לתשלום']
                const convertStatusToWord = statusWords[status]
                const convertIsPaidToWord = isPaid ? 'שולם' : 'לא שולם'
                const relatedToNames = relatedTo ? relatedTo.join(',') : 'נוסע לבד'

                var row = name + "\t" + convertIsPaidToWord + "\t" + convertStatusToWord + "\t" + ticketName.name + "\t" + relatedToNames + "\n";
                writeStream.write(row);
            } else {
                console.log('initPassengersArr[i] is null: ', initPassengersArr[i]);
                var row = 'there is no information' + "\n";
                writeStream.write(row);
            }
        }
    }
}

const exists = async (path) => {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}


module.exports = router;
