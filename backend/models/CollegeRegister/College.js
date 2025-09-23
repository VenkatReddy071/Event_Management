const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    contactName: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('College', CollegeSchema);
