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



const sendMail = async (mailOptions) => {
    const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Amit 👻" <amit@example.com>', // sender address
            to: "amitashdot@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
}
sendMail();