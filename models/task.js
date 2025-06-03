const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    agentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'agents',
        required:true
    },
    firstname:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    notes:{
        type:String,
        required:true
    },
})

const tasks = mongoose.model("tasks",taskSchema)
module.exports = tasks