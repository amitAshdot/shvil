const mongoose = require('mongoose');

const FilesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    pdfFiles: {
        type: Array,
        required: true
    },
    tripNumber: {
        type: String,
        unique: true,
        required: true
    },

})

module.exports = Files = mongoose.model('file', FilesSchema);