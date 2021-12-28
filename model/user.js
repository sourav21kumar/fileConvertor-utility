const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fileOriginalName : {
        type:String,
        required:[true,'This fiels is required']
    },
    mimeType:{
        type:String,
        required:[true,'This fiels is required']
    },
    destinationPath:{
        type:String,
        required:[true,'This field is required']
    },
    size:{
        type:Number,
        required:[true,"This field is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    tempFilePath:{
        type:String,
        default:' '
    }


})

const User = mongoose.model('user',userSchema);
module.exports = User;