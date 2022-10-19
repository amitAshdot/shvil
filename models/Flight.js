const mongoose = require('mongoose');
const passengers = require('./Passengers');

const FlightSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tripNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    pdfName: {
        type: Array
    },
    pdfFiles: {
        type: Array,
    },
    tripDate: {
        type: Date,
        required: true
    },
    passengers: [{

        no: { // passenger number
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        ticketName: {
            type: Object,
            required: true
        },
        status: { // 0 = new, 1 = notSent, 2 = sentFullyPaid, 3 = sentNotPaid
            type: Number,
            default: 0
        },
        relatedTo: { // passenger number
            type: [String],
            default: -1
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    folderName: {
        type: String,
        required: true
    },
    pathToReport: {
        type: String
    }
});

module.exports = Flight = mongoose.model('flight', FlightSchema);