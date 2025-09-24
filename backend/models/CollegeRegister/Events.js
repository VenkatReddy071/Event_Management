const mongoose = require('mongoose');

const SubeventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    registrationPrice:{
        type: String,
        required: true
    },
    paymentScanner:{
        type: String,
        required: true
    },
    winningPrices:[
        {
        position:{
            type:String,
            required:true,
        },
        winningPrice:{
            type:String,
        }
    }
    ],
    eventDate:{
        type: Date,
        required: true
    },
    time:{
        type:String,
        required:true,
    },
    participationCertificate:{
        type:Boolean,
        default:true,
    },
    team:{
        type:Number,
        min:1,
        max:5,
    },

    venue:{
        type:String,
        required:true,
    },

    eventType: {
        type: String,
        enum: ['Technical', 'Non-Technical'],
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true
    },
    studentCoordinator1:{
        type:String,
        required:true,
    },
    studentContact1:{
        type:String,
        required:true,
    },
    studentCoordinator2:{
        type:String,
        required:true,
    },
    studentContact2:{
        type:String,
        required:true,
    },
    facultyCoordinator:{
        type:String,
        required:true,
    },
    facultyContact:{
        type:String,
        required:true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('Subevent', SubeventSchema);
