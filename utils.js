//requiring path and fs modules
var path = require('path');
var fs = require('fs');
const pdf = require('pdf-parse');

const mainFunction = (FILE_PATH) => {
    if (!FILE_PATH) {
        console.log("No FILE_PATH, FILE_PATH: ", FILE_PATH);
    }
    //joining path of directory 
    var directoryPath = path.join('pdf', '');
    //only pdf
    const EXTENSION = '.pdf';
    let peopleObjectArr = []
    try {
        const files = fs.readdirSync(directoryPath, { withFileTypes: true });
        const targetFiles = files.filter(file => {
            return path.extname(file.name).toLowerCase() === EXTENSION;
        });

        // Basic Usage
        targetFiles.forEach(file => {
            if (fs.existsSync(`${FILE_PATH}/${file.name}`)) {
                let dataBuffer = fs.readFileSync(`${FILE_PATH}/${file.name}`);
                pdf(dataBuffer)
                    .then(function (data) {
                        var reName = /Passenger:(.*)\n/gm;
                        var name = "";
                        let match = reName.exec(data.text);
                        if (match != null) {
                            name = match[1];
                            name = name.replace(/([A-Z])/g, ' $1').trim();
                            peopleObjectArr.push({ name: name, isPaid: false, isTicketSent: false, ticketName: file });
                            return { name: name, isPaid: false, isTicketSent: false, ticketName: file }
                        }
                    }).then(function (data) {
                        //check Kav system api for each customer file(pdf)
                        // EXAMPLE:
                        // if(data.name === kavFlightMemberArr) 
                        //      do stuff
                        console.log(peopleObjectArr)
                    })
                    .catch(function (error) {
                        console.log('error pad-parse: ', error)
                    });

            }
        });
    } catch (err) {
        console.log(err)
    }

}

module.exports = { mainFunction };
