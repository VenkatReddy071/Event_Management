const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum:['technical','nontechnical','both'],
    },
    posterUrl: {
        type: String
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    departments:{
        type:String,
        required:true,
    },
    subevents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subevent'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('Event', EventSchema);
