const mongoose = require('mongoose')

const msgSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    data:{
        type:String,
        default:Date.now()
    }
})

const Message = mongoose.model('msg',msgSchema)
module.exports = Message;