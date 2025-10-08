const mongoose=require("mongoose");

const registerScheme=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    CollegeName:{
        type:String,
        require:true,
    },
    year:{
        type:String,
        require:true,
    },
    branch:{
        type:String,
        require:true,
    },
    semister:{
        type:String,
        require:true,
    },
    paymentId:{
        type:String,
        require:true,
        unique:true,
    },
    paymentScreenShot:{
        type:String,
        require:true,
    },
    groupType:{
        type:String,
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    
    subEvent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subevent',
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},{timestamps:true});
module.exports = mongoose.model('userRegister', registerScheme);
