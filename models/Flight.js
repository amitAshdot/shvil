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
        pdfName: {
            type: String,
            required: true
        },
        name: {
            type: String,
        },
        status: { // 0 = new, 1 = notSent, 2 = sentFullyPaid, 3 = sentNotPaid
            type: Number,
            default: 0
        },
        haveRelated: {
            type: Boolean,
            default: false
        },
        related: { // passenger number
            type: Number,
            default: -1
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    folderName: {
        type: String,
        default: new Date().getTime()
    }
});

module.exports = Flight = mongoose.model('flight', FlightSchema);